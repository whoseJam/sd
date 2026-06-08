export interface Message {
  id: string;
  ts: number;
  from: "user" | "agent" | "system";
  kind?: "tool" | "info";
  text: string;
  images?: string[];
  raw?: unknown;
}
