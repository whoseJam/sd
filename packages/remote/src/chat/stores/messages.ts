import { createSignal } from "solid-js";
import { createStore, produce } from "solid-js/store";

import type { Message } from "../types";

interface LocalMessage extends Message {
  failed?: boolean;
}

const [messages, setMessages] = createStore<LocalMessage[]>([]);
const [loading, setLoading] = createSignal<string | null>(null);

const seen = new Set<string>();
// Optimistic user bubbles waiting to be adopted by their server-issued
// twin. Server can deliver the twin via SSE before our POST response
// returns; without this map we'd end up with two bubbles for one prompt.
const pendingOptimistic = new Map<string, string>();
let lastTs = 0;

export { messages, loading };

export function clearMessages(): void {
  seen.clear();
  pendingOptimistic.clear();
  lastTs = 0;
  setLoading(null);
  setMessages([]);
}

export function showLoading(text: string): void {
  setLoading(text);
}

export function clearLoading(): void {
  setLoading(null);
}

export function registerOptimistic(optimisticId: string, text: string): void {
  pendingOptimistic.set(text, optimisticId);
}

export function clearOptimistic(text: string): void {
  pendingOptimistic.delete(text);
}

export function latestTs(): number {
  return lastTs;
}

// Adopt a server id onto an optimistic bubble: future polls see the same
// id and skip; future text-dedup against this user message still works.
export function adoptServerId(optimisticId: string, serverId: string): void {
  if (!optimisticId || !serverId) return;
  seen.add(serverId);
  const idx = messages.findIndex((m) => m.id === optimisticId);
  if (idx >= 0) setMessages(idx, "id", serverId);
}

export function markFailed(id: string): void {
  const idx = messages.findIndex((m) => m.id === id);
  if (idx >= 0) setMessages(idx, "failed", true);
}

export function appendOptimistic(message: LocalMessage): void {
  seen.add(message.id);
  setMessages(produce((list) => list.push(message)));
}

export function renderMsg(message: Message): void {
  if (seen.has(message.id)) return;
  if (
    message.from === "user" &&
    message.text &&
    pendingOptimistic.has(message.text)
  ) {
    const optimisticId = pendingOptimistic.get(message.text)!;
    pendingOptimistic.delete(message.text);
    adoptServerId(optimisticId, message.id);
    return;
  }
  clearLoading();
  seen.add(message.id);
  if (message.ts > lastTs) lastTs = message.ts;
  setMessages(produce((list) => list.push(message)));
}
