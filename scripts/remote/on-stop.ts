#!/usr/bin/env bun
// Claude Code Stop hook: when Claude finishes a turn, read the last assistant
// text from the transcript and POST it to the local chat server so the phone
// sees the reply. Reads JSON from stdin per Claude Code hook spec.
//
// Designed to be inert outside the remote workflow:
//   - skips silently if not running inside tmux (TMUX env var unset)
//   - skips silently if the chat server isn't reachable on PORT
//   - skips silently on any error so it never blocks Claude

import { existsSync, readFileSync } from "node:fs";

const PORT = Number(process.env.PORT ?? 8765);

interface HookInput {
  session_id?: string;
  transcript_path?: string;
  stop_hook_active?: boolean;
}

interface TranscriptEntry {
  type?: string;
  message?: {
    role?: string;
    content?:
      | string
      | { type: string; text?: string }[];
  };
}

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of Bun.stdin.stream()) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString("utf-8");
}

function lastAssistantText(transcript: string): string {
  const lines = readFileSync(transcript, "utf-8").split("\n").filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    let entry: TranscriptEntry;
    try {
      entry = JSON.parse(lines[i]);
    } catch {
      continue;
    }
    const msg = entry.message;
    if (!msg || msg.role !== "assistant") continue;
    const content = msg.content;
    if (typeof content === "string") {
      if (content.trim()) return content.trim();
      continue;
    }
    if (Array.isArray(content)) {
      const texts: string[] = [];
      for (const block of content) {
        if (block.type === "text" && block.text) texts.push(block.text);
      }
      if (texts.length > 0) return texts.join("\n\n").trim();
    }
  }
  return "";
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

  const text = lastAssistantText(transcript);
  if (!text) return;

  const form = new FormData();
  form.append("text", text);
  for (const p of findImagePaths(text)) {
    try {
      form.append("image", Bun.file(p));
    } catch {
      // unreadable, skip
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

// Match local image paths the agent might reference (e.g. snapshot tool
// outputs under /tmp). Only files that actually exist are kept; arbitrary
// internet URLs are ignored.
const IMAGE_PATH_RE = /(?:\/tmp|\/Users\/[\w./-]+)\/[\w./-]+\.(?:png|jpg|jpeg|gif|webp)/gi;

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

main().catch(() => {});
