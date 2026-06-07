// Thin wrappers around the chat server's JSON / form endpoints. Centralized
// so future swaps (e.g. WebSocket transport, retry) happen in one place.

export async function fetchMessages(sinceMs) {
  const r = await fetch(`/api/messages?since=${sinceMs}`);
  if (!r.ok) return [];
  return r.json();
}

export async function sendUserMessage(text) {
  await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

export async function fetchStatus() {
  try {
    const r = await fetch("/api/status");
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function fetchPreview() {
  try {
    const r = await fetch("/api/preview");
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function setPreview(url, label = "") {
  await fetch("/api/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, label }),
  });
}

export async function restartClaude() {
  try {
    await fetch("/api/restart-claude", { method: "POST" });
  } catch {}
}
