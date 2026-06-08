#!/usr/bin/env bun
// Chat server. JSONL is the single source of truth — TranscriptWatcher polls
// the pinned session JSONL and dispatches each new line via an adapter. The
// `messages` array is an in-memory cache rebuilt on every boot.

import { existsSync, mkdirSync, readFileSync, statSync, watch } from "node:fs";
import { extname, join } from "node:path";

import type { Message } from "./message";

import { claudeCodeAdapter } from "./adapters/claude-code";
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
let messages: Message[] = [];

// Centralized message ingest — watcher, POST handler, and system helpers
// all funnel through here so SSE broadcast happens once.
function appendMessage(message: Message): void {
  if (messages.some((existing) => existing.id === message.id)) return;
  // A user prompt arrives optimistically on POST and again ~1s later from
  // the JSONL replay. Coalesce by text within a 60s window.
  if (message.from === "user" && message.text) {
    const text = message.text.trim();
    for (let i = messages.length - 1; i >= 0; i--) {
      const previous = messages[i];
      if (message.ts - previous.ts > 60_000) break;
      if (previous.from === "user" && previous.text.trim() === text) return;
    }
  }
  messages.push(message);
  sseBroadcast(message);
  if (
    message.from === "agent" &&
    (message.text || (message.images?.length ?? 0) > 0)
  ) {
    responding = false;
  }
}

function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function tmuxHasSession(): boolean {
  const result = Bun.spawnSync({
    cmd: ["tmux", "has-session", "-t", TMUX_SESSION],
    stdout: "pipe",
    stderr: "pipe",
  });
  return result.exitCode === 0;
}

function tmuxPaneCommand(): string {
  const result = Bun.spawnSync({
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
  if (result.exitCode !== 0) return "";
  return new TextDecoder().decode(result.stdout).trim();
}

const SHELL_NAMES = new Set(["fish", "bash", "zsh", "sh", "dash", "ksh"]);

function claudeRunning(): boolean {
  if (!tmuxHasSession()) return false;
  const command = tmuxPaneCommand().toLowerCase();
  if (!command) return false;
  return !SHELL_NAMES.has(command);
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

function tmuxStartClaude(options: { resume?: string } = {}): void {
  const parts = ["claude", ...CLAUDE_BASE_FLAGS];
  if (options.resume) parts.push("--resume", options.resume);
  tmuxSendKeys(parts.join(" "));
}

async function tmuxQuitClaude(): Promise<void> {
  Bun.spawnSync({ cmd: ["tmux", "send-keys", "-t", TMUX_SESSION, "C-c"] });
  await sleep(150);
  Bun.spawnSync({ cmd: ["tmux", "send-keys", "-t", TMUX_SESSION, "C-c"] });
  await sleep(500);
  for (let attempt = 0; attempt < 20; attempt++) {
    const command = tmuxPaneCommand().toLowerCase();
    if (!command || SHELL_NAMES.has(command)) break;
    await sleep(200);
  }
}

function makeSystemMessage(text: string): Message {
  return { id: newId(), ts: Date.now(), from: "system", text };
}

// ── SSE ──────────────────────────────────────────────────────────────────
let nextStreamId = 0;
const sseStreams = new Map<
  number,
  ReadableStreamDefaultController<Uint8Array>
>();
const sseEncoder = new TextEncoder();

function sseBroadcast(message: Message): void {
  sseSend("message", message);
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

// ── Reload epoch ─────────────────────────────────────────────────────────
// Polled by an injected client script (SSE-free so it works through
// cloudflared). Debounced so a webpack rebuild burst counts as one reload.
let reloadEpoch = 0;
let reloadTimer: ReturnType<typeof setTimeout> | null = null;
try {
  watch(REVEAL_ROOT, { recursive: true }, () => {
    if (reloadTimer) clearTimeout(reloadTimer);
    reloadTimer = setTimeout(() => {
      reloadEpoch++;
    }, 200);
  });
} catch {
  // fs.watch recursive not supported on this platform; silent.
}

const RELOAD_SCRIPT = `<script>(function(){let l=null;setInterval(function(){fetch('/api/reload-token').then(function(r){return r.json()}).then(function(j){if(l!==null&&j.epoch!==l)location.reload();l=j.epoch})},1000);})();</script>`;

// ── Transcript watcher ───────────────────────────────────────────────────
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
    path
      .split("/")
      .pop()
      ?.replace(/\.jsonl$/, "") ?? "";
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
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Static asset paths ───────────────────────────────────────────────────
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

function decodePath(path: string): string {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

// ── HTTP server ──────────────────────────────────────────────────────────
Bun.serve({
  port: PORT,
  async fetch(request) {
    const url = new URL(request.url);
    const path = decodePath(url.pathname);

    if (path === "/" || path === "/chat" || path === "/chat.html") {
      return new Response(readFileSync(CHAT_HTML_PATH), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    if (path.startsWith("/chat/")) {
      const relative = path.slice("/chat/".length);
      const filePath = join(CHAT_DIR, relative);
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

    if (path === "/api/messages") {
      if (request.method === "GET") {
        const since = Number(url.searchParams.get("since") ?? 0);
        return Response.json(messages.filter((m) => m.ts > since));
      }
      if (request.method === "POST") {
        const body = (await request.json()) as { text?: unknown };
        const text = String(body.text ?? "").trim();
        if (!text) return new Response("empty", { status: 400 });
        const message: Message = {
          id: newId(),
          ts: Date.now(),
          from: "user",
          text,
        };
        appendMessage(message);
        responding = true;
        respondingSince = Date.now();
        if (!tmuxHasSession()) {
          appendMessage(
            makeSystemMessage(
              "tmux session 'claude-dev' isn't running. Run packages/remote/bin/start.ts on the Mac first.",
            ),
          );
        } else if (!claudeRunning()) {
          appendMessage(
            makeSystemMessage(
              `Claude isn't running in tmux (shell: ${tmuxPaneCommand() || "?"}). Tap the status pill to restart it, or type 'claude' in the tmux pane.`,
            ),
          );
        } else {
          tmuxSendKeys(text);
        }
        return Response.json(message);
      }
    }

    if (path === "/api/status") {
      const session = tmuxHasSession();
      const command = session ? tmuxPaneCommand() : "";
      const claude =
        session && command && !SHELL_NAMES.has(command.toLowerCase());
      if (responding && Date.now() - respondingSince > 5 * 60_000) {
        responding = false;
      }
      return Response.json({ session, cmd: command, claude, responding });
    }

    if (path === "/api/restart-claude" && request.method === "POST") {
      if (!tmuxHasSession()) {
        return Response.json(
          { ok: false, error: "no session" },
          { status: 400 },
        );
      }
      tmuxStartClaude();
      return Response.json({ ok: true });
    }

    if (path === "/api/reload-token") {
      return Response.json({ epoch: reloadEpoch });
    }

    if (path === "/api/sessions" && request.method === "GET") {
      const dir = claudeCodeAdapter.getTranscriptDir(REPO);
      const pinned = getPinnedPath();
      return Response.json({
        pinned,
        sessions: listSessions(dir, pinned),
      });
    }

    if (path === "/api/sessions/switch" && request.method === "POST") {
      const body = (await request.json()) as { path?: unknown };
      const target = typeof body.path === "string" ? body.path : "";
      if (!target || !target.endsWith(".jsonl")) {
        return Response.json({ ok: false, error: "bad path" }, { status: 400 });
      }
      await switchSession(target);
      return Response.json({ ok: true, pinned: target });
    }

    if (path === "/api/sessions/new" && request.method === "POST") {
      const result = await newSession();
      if (!result.ok) return Response.json(result, { status: 500 });
      return Response.json(result);
    }

    if (path === "/api/stream") {
      // cloudflared quick tunnels swallow text/event-stream chunks, so the
      // client also polls /api/messages every 2s as the real transport.
      const id = nextStreamId++;
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          sseStreams.set(id, controller);
          controller.enqueue(sseEncoder.encode(": connected\n\n"));
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

    // ── Static fallback under REVEAL_ROOT ─────────────────────────────────
    let resolvedPath = path;
    if (resolvedPath.endsWith("/")) resolvedPath += "index.html";
    const filePath = join(REVEAL_ROOT, resolvedPath);
    if (!filePath.startsWith(REVEAL_ROOT)) {
      return new Response("forbidden", { status: 403 });
    }
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      const mime = contentType(filePath);
      // HTML — full docs get the reload poller injected, fragments stay
      // clean. Either way no-store: the watcher rewrites these on every edit.
      if (mime.startsWith("text/html")) {
        let html = readFileSync(filePath, "utf-8");
        if (html.includes("</body>")) {
          html = html.replace("</body>", RELOAD_SCRIPT + "</body>");
        }
        return new Response(html, {
          headers: { "Content-Type": mime, "Cache-Control": "no-store" },
        });
      }
      // JS / CSS / fonts / images: cached so 27 sd-animation iframes don't
      // each pay the full download cost through the tunnel. Reload-token
      // forces a full page reload on watcher rewrites, bounding staleness.
      return new Response(Bun.file(filePath), {
        headers: {
          "Content-Type": mime,
          "Cache-Control": "public, max-age=300",
        },
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
