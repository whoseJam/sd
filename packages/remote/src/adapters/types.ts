// A new agent (Codex, Aider, ...) becomes a single file in adapters/ —
// server, watcher, UI all stay untouched.

import type { Message } from "../message";

export interface AgentAdapter {
  readonly name: string;

  // Directory where this agent writes per-session transcript JSONL files.
  getTranscriptDir(cwd: string): string;

  // Convert one parsed transcript entry into zero or more chat messages.
  // Pure — the watcher handles dedup / IO. Return [] to skip.
  parseEntry(entry: unknown): Message[];
}
