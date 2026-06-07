// AgentAdapter — tells the TranscriptWatcher where an agent writes its
// session log on disk, and how to turn one log entry into 0+ chat messages.
//
// Design intent: a new agent (Codex, Aider, ...) becomes a single file in
// adapters/ — server, watcher, UI, CLI all stay untouched. The watcher is
// adapter-agnostic; it just polls the file and dispatches each new line.
//
// Compare to the previous design (pre-watcher) where adapters parsed
// Claude Code hook stdin: the new contract is narrower and more declarative
// — no hook system on the user's machine is required.

import type { Message } from "../message";

export interface AgentAdapter {
  readonly name: string;

  /** Where this agent writes per-session transcript JSONL files. The watcher
   *  scans this directory for the most recently modified .jsonl. */
  getTranscriptDir(cwd: string): string;

  /** Convert one parsed transcript entry into zero or more chat messages.
   *  Implementations should be pure — the watcher handles dedup, IO,
   *  persistence. Return [] for entries that should not surface (system
   *  meta, file-history snapshots, user prompts already echoed via
   *  /api/messages, etc.). */
  parseEntry(entry: unknown): Message[];
}
