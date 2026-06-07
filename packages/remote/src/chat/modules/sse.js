// Subscribe to /api/stream and dispatch named events to handlers.
// EventSource auto-reconnects on disconnect; on reconnect we call the
// onReconnect callback so the caller can run a catch-up fetch.

export function connectSSE({
  onMessage,
  onPreview,
  onSessionChanged,
  onReconnect,
} = {}) {
  if (typeof EventSource === "undefined") return null;
  const es = new EventSource("/api/stream");
  es.addEventListener("message", (e) => {
    if (!onMessage) return;
    try {
      onMessage(JSON.parse(e.data));
    } catch {}
  });
  es.addEventListener("preview", (e) => {
    if (!onPreview) return;
    try {
      onPreview(JSON.parse(e.data));
    } catch {}
  });
  es.addEventListener("session-changed", (e) => {
    if (!onSessionChanged) return;
    try {
      onSessionChanged(JSON.parse(e.data));
    } catch {}
  });
  es.addEventListener("open", () => {
    if (onReconnect) onReconnect();
  });
  return es;
}
