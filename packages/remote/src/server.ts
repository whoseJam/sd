#!/usr/bin/env bun
// Chat server for the remote phone-↔-desktop-Claude workflow.
//
// JSONL is the single source of truth. The TranscriptWatcher polls the
// pinned agent session JSONL and dispatches each new line into chat
// messages via an adapter. The `messages` array is an in-memory cache of
// "what the current session's JSONL parses into" — never written to disk.
// On boot the watcher replays the file from offset 0, rebuilding the cache;
// on session switch we reset and re-parse the new file. No hook system
// needs to be installed on the user's machine.
//
// Routes:
//   GET  /                   chat UI (chat/index.html)
//   /chat/*                  chat client static assets
//   GET  /api/messages?since=<ts>
//   POST /api/messages       user-sent message; forwarded to tmux send-keys
//   GET  /api/status         {session, claude, responding}
//   POST /api/restart-claude relaunch Claude in tmux
//   GET  /api/preview        current preview state
//   POST /api/preview        set/clear preview URL
//   GET  /api/stream         SSE: live messages + preview events
//   /snapshots/<file>        image attachments (referenced from messages)
//   /<anything-else>         static files under REVEAL_ROOT

import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { extname, join } from "node:path";

import { claudeCodeAdapter } from "./adapters/claude-code";
import type { Message } from "./message";
import {
  getPinnedPath,
  listSessions,
  pinSession,
  writeBaseline,
} from "./sessions";
import { TranscriptWatcher } from "./watcher/transcript-watcher";

const REVEAL_ROOT = process.env.REVEAL_ROOT ?? "/tmp/sd-test";
const TMUX_SESSION = process.env.TMUX_SESSION ?? "claude-dev";
const PORT = Number(process.env.PORT ?? 8765);
const REPO = process.env.REPO ?? process.cwd();
const SNAPSHOTS_DIR = join(REVEAL_ROOT, "snapshots");

mkdirSync(REVEAL_ROOT, { recursive: true });
mkdirSync(SNAPSHOTS_DIR, { recursive: true });

let responding = false;
let respondingSince = 0;
let currentPreview: { url: string; label: string } | null = null;

// In-memory only. Rebuilt from JSONL on every boot via the watcher.
let messages: Message[] = [];

// Centralized message ingest. Watcher, user POST handler, and system-msg
// helpers all funnel through here so SSE broadcast happens once.
function appendMessage(m: Message): void {
  // Idempotent: skip if we've already stored this id.
  if (messages.some((existing) => existing.id === m.id)) return;
  // Optimistic POST → JSONL replay dedup: a user prompt is rendered the
  // moment the client POSTs, then again ~1s later when Claude flushes the
  // entry to JSONL. We coalesce by text equality within a 60s window so
  // exactly one bubble survives.
  if (m.from === "user" && m.text) {
    const text = m.text.trim();
    for (let i = messages.length - 1; i >= 0; i--) {
      const x = messages[i];
      if (m.ts - x.ts > 60_000) break;
      if (x.from === "user" && x.text.trim() === text) return;
    }
  }
  messages.push(m);
  sseBroadcast(m);
  if (m.from === "agent" && (m.text || (m.images?.length ?? 0) > 0)) {
    responding = false;
  }
}

function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function tmuxHasSession(): boolean {
  const r = Bun.spawnSync({
    cmd: ["tmux", "has-session", "-t", TMUX_SESSION],
    stdout: "pipe",
    stderr: "pipe",
  });
  return r.exitCode === 0;
}

function tmuxPaneCommand(): string {
  const r = Bun.spawnSync({
    cmd: [
      "tmux",
      "display-message",
      "-p",
      "-t",
      TMUX_SESSION,
      "-F",
      "#{pane_current_command}",
    ],
    stdout: "pipe",
    stderr: "pipe",
  });
  if (r.exitCode !== 0) return "";
  return new TextDecoder().decode(r.stdout).trim();
}

const SHELL_NAMES = new Set(["fish", "bash", "zsh", "sh", "dash", "ksh"]);

function claudeRunning(): boolean {
  if (!tmuxHasSession()) return false;
  const cmd = tmuxPaneCommand().toLowerCase();
  if (!cmd) return false;
  return !SHELL_NAMES.has(cmd);
}

function tmuxSendKeys(text: string): void {
  Bun.spawnSync({
    cmd: ["tmux", "send-keys", "-t", TMUX_SESSION, "-l", text],
  });
  Bun.spawnSync({
    cmd: ["tmux", "send-keys", "-t", TMUX_SESSION, "Enter"],
  });
}

const CLAUDE_BASE_FLAGS = ["--dangerously-skip-permissions"];

function tmuxStartClaude(opts: { resume?: string } = {}): void {
  const parts = ["claude", ...CLAUDE_BASE_FLAGS];
  if (opts.resume) parts.push("--resume", opts.resume);
  tmuxSendKeys(parts.join(" "));
}

async function tmuxQuitClaude(): Promise<void> {
  Bun.spawnSync({ cmd: ["tmux", "send-keys", "-t", TMUX_SESSION, "C-c"] });
  await sleep(150);
  Bun.spawnSync({ cmd: ["tmux", "send-keys", "-t", TMUX_SESSION, "C-c"] });
  await sleep(500);
  for (let i = 0; i < 20; i++) {
    const cmd = tmuxPaneCommand().toLowerCase();
    if (!cmd || SHELL_NAMES.has(cmd)) break;
    await sleep(200);
  }
}

function makeSystemMsg(text: string): Message {
  return { id: newId(), ts: Date.now(), from: "system", text };
}

// ── SSE infrastructure ────────────────────────────────────────────────────
let nextStreamId = 0;
const sseStreams = new Map<
  number,
  ReadableStreamDefaultController<Uint8Array>
>();
const sseEncoder = new TextEncoder();

function sseBroadcast(msg: Message): void {
  sseSend("message", msg);
}

function sseSend(event: string, data: unknown): void {
  const chunk = sseEncoder.encode(
    `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
  );
  for (const [id, controller] of sseStreams) {
    try {
      controller.enqueue(chunk);
    } catch {
      sseStreams.delete(id);
    }
  }
}

setInterval(() => {
  const ping = sseEncoder.encode(": ping\n\n");
  for (const [id, controller] of sseStreams) {
    try {
      controller.enqueue(ping);
    } catch {
      sseStreams.delete(id);
    }
  }
}, 25000);

// ── Transcript watcher ────────────────────────────────────────────────────
// Single dispatch point for agent-side messages. Adapter decides what each
// transcript line means; watcher handles polling, byte offsets, dedup
// across restarts. Server stays adapter-agnostic.
const watcher = new TranscriptWatcher({
  cwd: REPO,
  adapter: claudeCodeAdapter,
  onMessage: appendMessage,
});
watcher.start();

// ── Session switching ────────────────────────────────────────────────────
async function switchSession(path: string): Promise<void> {
  pinSession(path);
  messages = [];
  watcher.reset();
  const sessionId =
    path.split("/").pop()?.replace(/\.jsonl$/, "") ?? "";
  if (sessionId && tmuxHasSession()) {
    await tmuxQuitClaude();
    tmuxStartClaude({ resume: sessionId });
  }
  sseSend("session-changed", { pinned: path });
}

interface NewSessionResult {
  ok: boolean;
  error?: string;
}

async function newSession(): Promise<NewSessionResult> {
  if (!tmuxHasSession()) {
    return { ok: false, error: "tmux session not running" };
  }
  writeBaseline(claudeCodeAdapter.getTranscriptDir(REPO));
  await tmuxQuitClaude();
  tmuxStartClaude();
  pinSession("PENDING");
  messages = [];
  watcher.reset();
  sseSend("session-changed", { pinned: "" });
  return { ok: true };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}


// ── Static asset paths ────────────────────────────────────────────────────
const CHAT_DIR = new URL("./chat/", import.meta.url).pathname;
const CHAT_HTML_PATH = join(CHAT_DIR, "index.html");

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
};

function contentType(path: string): string {
  return MIME[extname(path).toLowerCase()] ?? "application/octet-stream";
}

function decodePath(p: string): string {
  try {
    return decodeURIComponent(p);
  } catch {
    return p;
  }
}

// ── HTTP server ───────────────────────────────────────────────────────────
Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = decodePath(url.pathname);

    if (path === "/" || path === "/chat" || path === "/chat.html") {
      return new Response(readFileSync(CHAT_HTML_PATH), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (path.startsWith("/chat/")) {
      const rel = path.slice("/chat/".length);
      const filePath = join(CHAT_DIR, rel);
      if (
        filePath.startsWith(CHAT_DIR) &&
        existsSync(filePath) &&
        statSync(filePath).isFile()
      ) {
        return new Response(Bun.file(filePath), {
          headers: { "Content-Type": contentType(filePath) },
        });
      }
      return new Response("not found", { status: 404 });
    }

    // ── Chat API ────────────────────────────────────────────────────────
    if (path === "/api/messages") {
      if (req.method === "GET") {
        const since = Number(url.searchParams.get("since") ?? 0);
        return Response.json(messages.filter((m) => m.ts > since));
      }
      if (req.method === "POST") {
        const body = (await req.json()) as { text?: unknown };
        const text = String(body.text ?? "").trim();
        if (!text) return new Response("empty", { status: 400 });
        const msg: Message = {
          id: newId(),
          ts: Date.now(),
          from: "user",
          text,
        };
        appendMessage(msg);
        responding = true;
        respondingSince = Date.now();
        if (!tmuxHasSession()) {
          appendMessage(
            makeSystemMsg(
              "tmux session 'claude-dev' isn't running. Run packages/remote/bin/start.ts on the Mac first.",
            ),
          );
        } else if (!claudeRunning()) {
          appendMessage(
            makeSystemMsg(
              `Claude isn't running in tmux (shell: ${tmuxPaneCommand() || "?"}). Tap the status pill to restart it, or type 'claude' in the tmux pane.`,
            ),
          );
        } else {
          tmuxSendKeys(text);
        }
        return Response.json(msg);
      }
    }

    if (path === "/api/status") {
      const session = tmuxHasSession();
      const cmd = session ? tmuxPaneCommand() : "";
      const claude =
        session && cmd && !SHELL_NAMES.has(cmd.toLowerCase());
      if (responding && Date.now() - respondingSince > 5 * 60_000) {
        responding = false;
      }
      return Response.json({ session, cmd, claude, responding });
    }

    if (path === "/api/restart-claude" && req.method === "POST") {
      if (!tmuxHasSession()) {
        return Response.json(
          { ok: false, error: "no session" },
          { status: 400 },
        );
      }
      tmuxStartClaude();
      return Response.json({ ok: true });
    }

    if (path === "/api/sessions" && req.method === "GET") {
      const dir = claudeCodeAdapter.getTranscriptDir(REPO);
      const pinned = getPinnedPath();
      return Response.json({
        pinned,
        sessions: listSessions(dir, pinned),
      });
    }

    if (path === "/api/sessions/switch" && req.method === "POST") {
      const body = (await req.json()) as { path?: unknown };
      const target = typeof body.path === "string" ? body.path : "";
      if (!target || !target.endsWith(".jsonl")) {
        return Response.json({ ok: false, error: "bad path" }, { status: 400 });
      }
      await switchSession(target);
      return Response.json({ ok: true, pinned: target });
    }

    if (path === "/api/sessions/new" && req.method === "POST") {
      const result = await newSession();
      if (!result.ok) {
        return Response.json(result, { status: 500 });
      }
      return Response.json(result);
    }

    if (path === "/api/preview") {
      if (req.method === "GET") {
        return Response.json({ preview: currentPreview });
      }
      if (req.method === "POST") {
        const body = (await req.json()) as {
          url?: unknown;
          label?: unknown;
        };
        const url = typeof body.url === "string" ? body.url.trim() : "";
        if (!url) {
          currentPreview = null;
        } else {
          currentPreview = {
            url,
            label: typeof body.label === "string" ? body.label : "",
          };
        }
        sseSend("preview", { preview: currentPreview });
        return Response.json({ preview: currentPreview });
      }
    }

    if (path === "/api/stream") {
      // SSE works fine over localhost but Cloudflare quick tunnels swallow
      // event-stream chunks, so the client also polls /api/messages every
      // 2s as the real transport over the tunnel.
      const id = nextStreamId++;
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          sseStreams.set(id, controller);
          controller.enqueue(sseEncoder.encode(": connected\n\n"));
          controller.enqueue(
            sseEncoder.encode(
              `event: preview\ndata: ${JSON.stringify({ preview: currentPreview })}\n\n`,
            ),
          );
        },
        cancel() {
          sseStreams.delete(id);
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "X-Accel-Buffering": "no",
        },
      });
    }

    // ── Static fallback ────────────────────────────────────────────────
    let p = path;
    if (p.endsWith("/")) p += "index.html";
    const filePath = join(REVEAL_ROOT, p);
    if (!filePath.startsWith(REVEAL_ROOT)) {
      return new Response("forbidden", { status: 403 });
    }
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      return new Response(Bun.file(filePath), {
        headers: { "Content-Type": contentType(filePath) },
      });
    }
    return new Response("not found", { status: 404 });
  },
});

console.log(`chat server listening on http://127.0.0.1:${PORT}`);
console.log(
  `tmux session: ${TMUX_SESSION} (alive: ${tmuxHasSession()}, claude: ${claudeRunning()}, pane: ${tmuxPaneCommand() || "—"})`,
);
console.log(
  `transcript watcher: ${claudeCodeAdapter.name}, cwd=${REPO}, polling ~/.claude/projects/`,
);
console.log("messages: in-memory cache, rebuilt from JSONL each boot");
