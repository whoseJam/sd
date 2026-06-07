// AgentAdapter — surface a CLI agent's hook events as transport-agnostic
// "stop" / "tool-use" payloads the chat server can consume.
//
// Each adapter receives the raw JSON the agent's hook system writes to stdin
// and decides whether that event is for itself. The dispatcher (hooks/on-hook.ts)
// finds the first matching adapter, parses, and POSTs to the chat server.
//
// To add a new agent (Codex, Aider, ...) implement this interface in a new
// file and append it to the dispatcher's adapter array. No server or UI code
// needs to change — every adapter normalizes to the same Reply / ToolUse
// shape.

export interface Reply {
  text: string;
  /** Absolute paths to local images referenced in the reply; the server
   *  copies them into snapshots/ and attaches to the message. */
  images?: string[];
}

export interface ToolUse {
  /** Display name of the tool (e.g. "Bash", "Read"). */
  tool: string;
  /** One-line summary for the chip's inline display. Empty = chip shows only
   *  the tool name; user can tap to expand and see `raw`. */
  summary: string;
  /** The full structured tool input — serialized into the chat message's
   *  <details> so a "硬核" user can see everything the agent passed. */
  raw: unknown;
  /** Image files the tool is about to use (e.g. Read on a PNG). */
  images?: string[];
}

export interface AgentAdapter {
  readonly name: string;

  /** Quick string-level check before JSON.parse. Returning true claims the
   *  event for this adapter; the dispatcher won't try others. */
  matches(rawInput: string): boolean;

  /** Parse a "turn finished" event. Return null for events of other kinds.
   *  The adapter is responsible for knowing its agent's event-name
   *  conventions (e.g. Claude Code uses `hook_event_name == "Stop"`). */
  parseStop(parsed: unknown): Reply | null;

  /** Parse a "tool about to run" event. */
  parsePreToolUse(parsed: unknown): ToolUse | null;

  /** Run after a Stop reply has been posted. Useful for state cleanup that
   *  depends on the agent's transcript / queue (e.g. marking JSONL UUIDs as
   *  posted so the next PreToolUse won't repost them). Optional. */
  syncAfterStop?(parsed: unknown): Promise<void>;
}
