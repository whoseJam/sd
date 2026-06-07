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

  // PreToolUse: try transcript reading. State tracks posted uuids to avoid
  // duplicates across hook fires within one turn.
  const transcript = input.transcript_path;
  if (!transcript || !existsSync(transcript)) {
    logLine(`  return: no transcript (${transcript})`);
    return;
  }

  let state = loadState();
  if (state.session_id !== input.session_id) {
    state = { session_id: input.session_id, posted_uuids: [] };
  }
  const postedSet = new Set(state.posted_uuids ?? []);

  const lines = readFileSync(transcript, "utf-8").split("\n").filter(Boolean);
  const newEntries: TranscriptEntry[] = [];
  for (const line of lines) {
    let entry: TranscriptEntry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }
    if (entry.type !== "assistant") continue;
    if (!entry.uuid || postedSet.has(entry.uuid)) continue;
    newEntries.push(entry);
  }

  logLine(
    `  state.posted_uuids=${state.posted_uuids?.length}  newEntries=${newEntries.length}  uuids=[${newEntries.map((e) => e.uuid?.slice(0, 8)).join(",")}]`,
  );

  if (newEntries.length === 0) return;

  for (const entry of newEntries) {
    const text = extractText(entry);
    if (text) {
      try {
        await postToChat(text);
        logLine(`  posted ${entry.uuid?.slice(0, 8)} text=${text.slice(0, 40)}`);
      } catch (e) {
        logLine(`  POST ERROR ${entry.uuid?.slice(0, 8)}: ${e}`);
      }
    }
    if (entry.uuid) postedSet.add(entry.uuid);
  }

  state.posted_uuids = [...postedSet];
  if (state.posted_uuids.length > 500) {
    state.posted_uuids = state.posted_uuids.slice(-500);
  }
  saveState(state);
}

main().catch(() => {});
