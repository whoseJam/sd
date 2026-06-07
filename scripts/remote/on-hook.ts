#!/usr/bin/env bun
// Claude Code hook: posts any assistant content the chat hasn't seen yet to
// the chat server, with auto-attached local image paths.
//
// Wired to both PreToolUse and Stop in .claude/settings.json so the phone
// sees intermediate text DURING a turn (whenever Claude reaches a tool-use
// boundary) instead of only at the very end. State (which assistant UUIDs
// we've already posted) is persisted in /tmp/sd-test/hook-state.json so
// each hook fire only posts what's new.
//
// Inert outside the tmux workflow: skips silently if TMUX env var is unset
// or the chat server is unreachable.

import { existsSync, readFileSync, writeFileSync } from "node:fs";

const PORT = Number(process.env.PORT ?? 8765);
const STATE_FILE =
  process.env.HOOK_STATE_FILE ?? "/tmp/sd-test/hook-state.json";

interface HookInput {
  session_id?: string;
  transcript_path?: string;
  hook_event_name?: string;
  stop_hook_active?: boolean;
  // Stop hook input includes the assistant text directly. Use this instead of
  // reading the JSONL transcript, which lags behind by one turn (Claude Code
  // fires the hook before flushing the JSONL).
  last_assistant_message?: string;
  // PreToolUse provides the tool being called.
  tool_name?: string;
  tool_input?: Record<string, unknown>;
}

interface HookState {
  session_id?: string;
  posted_uuids?: string[];
}

interface TranscriptEntry {
  uuid?: string;
  type?: string;
  message?: {
    role?: string;
    content?: string | { type: string; text?: string }[];
  };
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of Bun.stdin.stream()) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf-8");
}

const DEBUG = process.env.HOOK_DEBUG === "1";

function logLine(line: string): void {
  if (!DEBUG) return;
  try {
    writeFileSync("/tmp/sd-test/hook-debug.log", line + "\n", { flag: "a" });
  } catch {}
}

function loadState(): HookState {
  if (!existsSync(STATE_FILE)) return {};
  try {
    return JSON.parse(readFileSync(STATE_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function saveState(state: HookState): void {
  try {
    writeFileSync(STATE_FILE, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const IMAGE_PATH_RE =
  /(?:\/tmp|\/Users\/[\w./-]+)\/[\w./-]+\.(?:png|jpg|jpeg|gif|webp)/gi;

function findImagePaths(text: string): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const match of text.matchAll(IMAGE_PATH_RE)) {
    const path = match[0];
    if (seen.has(path)) continue;
    seen.add(path);
    if (existsSync(path)) out.push(path);
  }
  return out;
}

function extractText(entry: TranscriptEntry): string {
  const msg = entry.message;
  if (!msg || msg.role !== "assistant") return "";
  const content = msg.content;
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    const texts: string[] = [];
    for (const block of content) {
      if (block.type === "text" && block.text) texts.push(block.text);
    }
    return texts.join("\n\n").trim();
  }
  return "";
}

async function postToChat(text: string): Promise<void> {
  if (!text) return;
  const form = new FormData();
  form.append("text", text);
  for (const p of findImagePaths(text)) {
    try {
      form.append("image", Bun.file(p));
    } catch {
      // skip unreadable
    }
  }
  try {
    await fetch(`http://127.0.0.1:${PORT}/api/post-agent`, {
      method: "POST",
      body: form,
    });
  } catch {
    // server down, ignore
  }
}

async function main(): Promise<void> {
  const raw = await readStdin();
  if (DEBUG) {
    logLine(
      `${new Date().toISOString()}  TMUX=${process.env.TMUX ? "yes" : "no"}  raw=${raw.slice(0, 400)}`,
    );
  }

  if (!process.env.TMUX) return;

  let input: HookInput;
  try {
    input = JSON.parse(raw);
  } catch {
    logLine("  return: bad json");
    return;
  }
  if (input.stop_hook_active) {
    logLine("  return: stop_hook_active");
    return;
  }

  // Stop hook: use last_assistant_message from the hook input directly. The
  // JSONL transcript lags one turn behind (Claude Code fires Stop before
  // flushing JSONL to disk), which used to cause messages to drop.
  if (input.hook_event_name === "Stop") {
    const text = (input.last_assistant_message ?? "").trim();
    if (text) {
      try {
        await postToChat(text);
        logLine(`  posted (Stop) text=${text.slice(0, 80)}`);
      } catch (e) {
        logLine(`  POST ERROR: ${e}`);
      }
    }
    // Wait briefly for the JSONL to flush, then sync state by marking every
    // assistant uuid currently in the transcript as posted. This prevents the
    // next PreToolUse from re-posting entries Stop already handled.
    await new Promise((r) => setTimeout(r, 1200));
    if (input.transcript_path && existsSync(input.transcript_path)) {
      let state = loadState();
      if (state.session_id !== input.session_id) {
        state = { session_id: input.session_id, posted_uuids: [] };
      }
      const postedSet = new Set(state.posted_uuids ?? []);
      const lines = readFileSync(input.transcript_path, "utf-8")
        .split("\n")
        .filter(Boolean);
      for (const line of lines) {
        try {
          const entry = JSON.parse(line) as TranscriptEntry;
          if (entry.type === "assistant" && entry.uuid) {
            postedSet.add(entry.uuid);
          }
        } catch {
          // skip
        }
      }
      state.posted_uuids = [...postedSet];
      if (state.posted_uuids.length > 500) {
        state.posted_uuids = state.posted_uuids.slice(-500);
      }
      saveState(state);
      logLine(`  state synced: ${state.posted_uuids.length} uuids tracked`);
    }
    return;
  }

  // PreToolUse: post a compact tool chip to chat. We don't read the transcript
  // here — the tool_name + tool_input come directly in the hook input, and
  // the assistant text introducing this tool call will be posted by Stop.
  if (input.hook_event_name === "PreToolUse") {
    const toolName = input.tool_name ?? "?";
    const toolInput = input.tool_input ?? {};
    const summary = summarizeToolInput(toolName, toolInput);
    try {
      await fetch(`http://127.0.0.1:${PORT}/api/tool-call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool_name: toolName,
          summary,
          raw: toolInput,
        }),
      });
      logLine(`  posted tool: ${toolName} ${summary.slice(0, 60)}`);
    } catch (e) {
      logLine(`  tool POST ERROR: ${e}`);
    }
    return;
  }
}

// Render a one-line summary of a tool's input. Goal: feel like the `⏺ Bash(gulp
// sd -w)` line you see in the terminal, but short enough for a phone chip.
function summarizeToolInput(
  toolName: string,
  input: Record<string, unknown>,
): string {
  const trunc = (s: string, n = 80): string =>
    s.length > n ? s.slice(0, n - 1) + "…" : s;
  const get = (k: string): string =>
    typeof input[k] === "string" ? (input[k] as string) : "";

  switch (toolName) {
    case "Bash":
      return trunc(get("command"));
    case "Read":
    case "Write":
    case "Edit":
    case "NotebookEdit":
      return trunc(get("file_path").replace(/^.*\//, ""));
    case "Grep":
      return trunc(get("pattern"));
    case "Glob":
      return trunc(get("pattern"));
    case "WebFetch":
    case "WebSearch":
      return trunc(get("url") || get("query"));
    case "Task":
    case "Agent":
      return trunc(get("description") || get("subagent_type"));
    case "TaskCreate":
      return trunc(get("subject"));
    case "TaskUpdate":
      return trunc(get("taskId") + " " + (get("status") || get("subject")));
    case "TaskStop":
      return trunc(get("task_id") || get("shell_id"));
    case "ToolSearch":
      return trunc(get("query"));
    case "AskUserQuestion":
      return ""; // questions are an array; raw view shows them
    default: {
      // Generic fallback: first string-valued field, truncated.
      for (const key of Object.keys(input)) {
        const v = input[key];
        if (typeof v === "string" && v.length > 0) return trunc(v);
      }
      return "";
    }
  }
}

main().catch(() => {});
