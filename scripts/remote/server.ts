#!/usr/bin/env bun
// Chat server for the remote phone-↔-Claude workflow.
//
// Routes:
//   GET  /                  → chat UI (chat.html)
//   GET  /api/messages?since=<ts>  → messages with ts > since
//   POST /api/messages      → user-sent message (JSON {text}); also forwarded to
//                             tmux session via send-keys so Claude in tmux gets it
//   POST /api/post-agent    → agent-posted message (multipart: text + image*)
//   /snapshots/<file>       → image attachments
//   /<anything-else>        → static files under REVEAL_ROOT

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, extname, join } from "node:path";

const REVEAL_ROOT = process.env.REVEAL_ROOT ?? "/tmp/sd-test";
const TMUX_SESSION = process.env.TMUX_SESSION ?? "claude-dev";
const PORT = Number(process.env.PORT ?? 8765);
const MESSAGES_FILE = join(REVEAL_ROOT, "messages.json");
const SNAPSHOTS_DIR = join(REVEAL_ROOT, "snapshots");

mkdirSync(REVEAL_ROOT, { recursive: true });
mkdirSync(SNAPSHOTS_DIR, { recursive: true });

interface Message {
  id: string;
  ts: number;
  from: "user" | "agent" | "system";
  // For system messages: "tool" → render as inline gray chip (PreToolUse).
  // Undefined / "info" → render as default centered italic system bubble.
  kind?: "tool" | "info";
  text: string;
  images?: string[];
  // Raw tool_input JSON for tool chips. The UI shows a collapsed <details> the
  // user can tap to see the full parameters (file paths, full Bash commands,
  // task subjects, etc.).
  raw?: unknown;
}

// Tracks whether the in-tmux Claude is currently working on a user prompt.
// Set when a user message comes in, cleared when Stop hook posts the reply.
let responding = false;
let respondingSince = 0;

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

// SSE: track open streams so we can push new messages immediately.
let nextStreamId = 0;
const sseStreams = new Map<
  number,
  ReadableStreamDefaultController<Uint8Array>
>();
const sseEncoder = new TextEncoder();

function sseBroadcast(msg: Message): void {
  const chunk = sseEncoder.encode(`data: ${JSON.stringify(msg)}\n\n`);
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
  // Send literal text then Enter; -l prevents key-name interpretation
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

const CHAT_HTML_PATH = new URL("./chat.html", import.meta.url).pathname;

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

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path === "/" || path === "/chat" || path === "/chat.html") {
      return new Response(readFileSync(CHAT_HTML_PATH), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

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
        messages.push(msg);
        sseBroadcast(msg);
        responding = true;
        respondingSince = Date.now();
        if (!tmuxHasSession()) {
          const sysMsg = makeSystemMsg(
            "tmux session 'claude-dev' isn't running. Run scripts/remote/start-session.sh on the Mac first.",
          );
          messages.push(sysMsg);
          sseBroadcast(sysMsg);
        } else if (!claudeRunning()) {
          const sysMsg = makeSystemMsg(
            `Claude isn't running in tmux (shell: ${tmuxPaneCommand() || "?"}). Tap the status pill to restart it, or type 'claude' in the tmux pane.`,
          );
          messages.push(sysMsg);
          sseBroadcast(sysMsg);
        } else {
          tmuxSendKeys(text);
        }
        save();
        return Response.json(msg);
      }
    }

    if (path === "/api/stream") {
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

    if (path === "/api/status") {
      const session = tmuxHasSession();
      const cmd = session ? tmuxPaneCommand() : "";
      const claude = session && cmd && !SHELL_NAMES.has(cmd.toLowerCase());
      // Auto-clear stale responding flag after 5 min — guards against hook
      // never firing because of crash/disconnect.
      if (responding && Date.now() - respondingSince > 5 * 60_000) {
        responding = false;
      }
      return Response.json({ session, cmd, claude, responding });
    }

    if (path === "/api/tool-call" && req.method === "POST") {
      const body = (await req.json()) as {
        tool_name?: string;
        summary?: string;
        raw?: unknown;
      };
      const tool = String(body.tool_name ?? "?");
      const summary = String(body.summary ?? "").trim();
      const text = summary ? `${tool}  ${summary}` : tool;
      const msg: Message = {
        id: newId(),
        ts: Date.now(),
        from: "system",
        kind: "tool",
        text,
        raw: body.raw,
      };
      messages.push(msg);
      sseBroadcast(msg);
      save();
      return Response.json(msg);
    }

    if (path === "/api/responding-clear" && req.method === "POST") {
      responding = false;
      return Response.json({ ok: true });
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

    if (path === "/api/post-agent" && req.method === "POST") {
      const form = await req.formData();
      const text = String(form.get("text") ?? "").trim();
      const images: string[] = [];
      for (const value of form.getAll("image")) {
        if (!(value instanceof File)) continue;
        const fname = `agent-${Date.now()}-${basename(value.name)}`;
        const buf = new Uint8Array(await value.arrayBuffer());
        writeFileSync(join(SNAPSHOTS_DIR, fname), buf);
        images.push(fname);
      }
      if (!text && images.length === 0) {
        return new Response("empty", { status: 400 });
      }
      const msg: Message = {
        id: newId(),
        ts: Date.now(),
        from: "agent",
        text,
        ...(images.length > 0 && { images }),
      };
      messages.push(msg);
      sseBroadcast(msg);
      responding = false;
      save();
      return Response.json(msg);
    }

    // Static files
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
console.log(`messages.json: ${MESSAGES_FILE} (${messages.length} loaded)`);
