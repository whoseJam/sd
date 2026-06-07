// Shared message shape — wire format the chat UI renders by switching on
// `from` + `kind`.

export interface Message {
  id: string;
  ts: number;
  from: "user" | "agent" | "system";
  // "tool" = inline chip; undefined = default system bubble.
  kind?: "tool" | "info";
  text: string;
  // Filenames under /tmp/sd-test/snapshots/, served at /snapshots/<filename>.
  images?: string[];
  // For "tool" messages: the raw tool_input JSON shown in a collapsed
  // <details>.
  raw?: unknown;
}
