import type { Message } from "../types";

export interface SSEHandlers {
  onMessage?: (message: Message) => void;
  onSessionChanged?: (data: { pinned: string }) => void;
  onReconnect?: () => void;
}

export function connectSSE(handlers: SSEHandlers): EventSource | null {
  if (typeof EventSource === "undefined") return null;
  const stream = new EventSource("/api/stream");
  stream.addEventListener("message", (event) => {
    if (!handlers.onMessage) return;
    try {
      handlers.onMessage(JSON.parse(event.data));
    } catch {}
  });
  stream.addEventListener("session-changed", (event) => {
    if (!handlers.onSessionChanged) return;
    try {
      handlers.onSessionChanged(JSON.parse(event.data));
    } catch {}
  });
  stream.addEventListener("open", () => {
    handlers.onReconnect?.();
  });
  return stream;
}
