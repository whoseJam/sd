#!/usr/bin/env bun
// Chat server for the remote phone-↔-desktop-Claude workflow.
//
// Architecture: agent transcripts are the single source of truth. The
// TranscriptWatcher polls the active agent's session JSONL and dispatches
// each new line into chat messages via an adapter. No hook system needs to
// be installed on the user's machine; we just read what Claude Code (or any
// agent) writes anyway.
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
  writeFileSync,
} from "node:fs";
import { extname, join } from "node:path";

import { claudeCodeAdapter } from "./adapters/claude-code";
import type { Message } from "./message";
import { TranscriptWatcher } from "./watcher/transcript-watcher";

const REVEAL_ROOT = process.env.REVEAL_ROOT ?? "/tmp/sd-test";
const TMUX_SESSION = process.env.TMUX_SESSION ?? "claude-dev";
const PORT = Number(process.env.PORT ?? 8765);
const REPO = process.env.REPO ?? process.cwd();
const MESSAGES_FILE = join(REVEAL_ROOT, "messages.json");
const SNAPSHOTS_DIR = join(REVEAL_ROOT, "snapshots");

mkdirSync(REVEAL_ROOT, { recursive: true });
mkdirSync(SNAPSHOTS_DIR, { recursive: true });

let responding = false;
let respondingSince = 0;
let currentPreview: { url: string; label: string } | null = null;

let messages: Message[] = [];
if (existsSync(MESSAGES_FILE)) {
  try {
    messages = JSON.parse(readFileSync(MESSAGES_FILE, "utf-8"));
  } catch {
    console.warn("messages.json corrupt, starting fresh");
  }
}

function save(): void {
  writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

// Centralized message ingest. The watcher, the user POST handler, and the
// system-message helpers all funnel through here so SSE broadcast and
// persistence happen in exactly one place.
function appendMessage(m: Message): void {
  // Idempotent: skip if we've already stored this id.
  if (messages.some((existing) => existing.id === m.id)) return;
  messages.push(m);
  sseBroadcast(m);
  if (m.from === "agent" && (m.text || (m.images?.length ?? 0) > 0)) {
    responding = false;
  }
  save();
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

function tmuxStartClaude(): void {
  tmuxSendKeys("claude");
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
              "tmux session 'claude-dev' isn't running. Run packages/remote/bin/start-session.sh on the Mac first.",
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
console.log(`messages.json: ${MESSAGES_FILE} (${messages.length} loaded)`);
