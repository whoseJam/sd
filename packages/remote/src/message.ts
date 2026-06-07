// Message — the wire/storage format the chat UI consumes. Shared by the
// server, the transcript watcher, and the chat client.
//
// Single Source of truth: every message in chat — user prompts, agent
// replies, tool chips, images — uses this shape. The UI renders by
// switching on `from` + `kind`.

export interface Message {
  id: string;
  ts: number;
  from: "user" | "agent" | "system";
  /** For system messages: "tool" = inline gray chip; undefined = default
   *  italic centered system bubble. */
  kind?: "tool" | "info";
  text: string;
  /** Filenames under /tmp/sd-test/snapshots/ — server serves these at
   *  /snapshots/<filename>. */
  images?: string[];
  /** Raw tool_input JSON for "tool" messages; the UI shows it inside a
   *  collapsed <details> for hardcore inspection. */
  raw?: unknown;
}
