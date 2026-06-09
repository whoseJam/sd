export type MessageFrom = "user" | "agent" | "system";

export interface Message {
  id: string;
  ts: number;
  from: MessageFrom;
  text?: string;
  images?: string[];
  kind?: "tool";
  raw?: unknown;
}

export interface Session {
  path: string;
  title: string;
  mtime: number;
  entryCount: number;
  isActive: boolean;
}

export interface SessionsResponse {
  pinned: string;
  sessions: Session[];
}

export interface PreviewState {
  url: string;
  label: string;
}

export interface StatusResponse {
  session: boolean;
  cmd: string;
  claude: boolean;
  responding: boolean;
}

export interface LoaderMessage {
  source: "sd-loader";
  type: "ready" | "error" | "start" | "progress" | "done";
  name?: string;
  message?: string;
  loaded?: number;
  total?: number;
}

export interface ProgressEntry {
  loaded: number;
  total: number;
  done: boolean;
}
