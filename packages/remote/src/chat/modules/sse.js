// EventSource auto-reconnects; on (re)connect we call onReconnect so the
// caller can run a catch-up fetch.

export function connectSSE({
  onMessage,
  onSessionChanged,
  onReconnect,
} = {}) {
  if (typeof EventSource === "undefined") return null;
  const stream = new EventSource("/api/stream");
  stream.addEventListener("message", (event) => {
    if (!onMessage) return;
    try {
      onMessage(JSON.parse(event.data));
    } catch {}
  });
  stream.addEventListener("session-changed", (event) => {
    if (!onSessionChanged) return;
    try {
      onSessionChanged(JSON.parse(event.data));
    } catch {}
  });
  stream.addEventListener("open", () => {
    if (onReconnect) onReconnect();
  });
  return stream;
}
