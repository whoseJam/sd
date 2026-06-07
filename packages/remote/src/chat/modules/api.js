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

export async function restartClaude() {
  try {
    await fetch("/api/restart-claude", { method: "POST" });
  } catch {}
}

export async function fetchSessions() {
  try {
    const r = await fetch("/api/sessions");
    if (!r.ok) return { pinned: "", sessions: [] };
    return r.json();
  } catch {
    return { pinned: "", sessions: [] };
  }
}

export async function switchSession(path) {
  try {
    const r = await fetch("/api/sessions/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

export async function newSession() {
  try {
    const r = await fetch("/api/sessions/new", { method: "POST" });
    return r.json();
  } catch {
    return { ok: false };
  }
}
