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
  if (!process.env.TMUX) return;

  let input: HookInput;
  try {
    input = JSON.parse(await readStdin());
  } catch {
    return;
  }
  if (input.stop_hook_active) return;

  const transcript = input.transcript_path;
  if (!transcript || !existsSync(transcript)) return;

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

  if (newEntries.length === 0) return;

  for (const entry of newEntries) {
    const text = extractText(entry);
    if (text) await postToChat(text);
    if (entry.uuid) postedSet.add(entry.uuid);
  }

  state.posted_uuids = [...postedSet];
  if (state.posted_uuids.length > 500) {
    state.posted_uuids = state.posted_uuids.slice(-500);
  }
  saveState(state);
}

main().catch(() => {});
