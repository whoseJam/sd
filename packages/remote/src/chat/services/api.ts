import type {
  Message,
  PreviewState,
  SessionsResponse,
  StatusResponse,
} from "../types";

export async function fetchMessages(sinceMs: number): Promise<Message[]> {
  const response = await fetch(`/api/messages?since=${sinceMs}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function sendUserMessage(text: string): Promise<Message> {
  const response = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error(`server returned ${response.status}`);
  return response.json();
}

export async function fetchStatus(): Promise<StatusResponse> {
  const response = await fetch("/api/status");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// view.ts writes /preview-url.txt under /tmp/sd-test/; server already serves
// that path statically, so no API endpoint is involved here.
export async function fetchPreview(): Promise<PreviewState | null> {
  try {
    const response = await fetch("/preview-url.txt", { cache: "no-store" });
    if (!response.ok) return null;
    const line = (await response.text()).trim();
    if (!line) return null;
    const [url, label = ""] = line.split("\t");
    return { url, label };
  } catch {
    return null;
  }
}

export async function restartClaude(): Promise<void> {
  try {
    await fetch("/api/restart-claude", { method: "POST" });
  } catch {}
}

export async function fetchSessions(): Promise<SessionsResponse> {
  try {
    const response = await fetch("/api/sessions");
    if (!response.ok) return { pinned: "", sessions: [] };
    return response.json();
  } catch {
    return { pinned: "", sessions: [] };
  }
}

export async function switchSession(path: string): Promise<boolean> {
  try {
    const response = await fetch("/api/sessions/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export interface NewSessionResult {
  ok: boolean;
  error?: string;
}

export async function newSession(): Promise<NewSessionResult> {
  try {
    const response = await fetch("/api/sessions/new", { method: "POST" });
    return response.json();
  } catch {
    return { ok: false };
  }
}
