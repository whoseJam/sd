import { createSignal } from "solid-js";

import { fetchStatus, restartClaude } from "../services/api";

export type ConnectionTier = "alive" | "down" | "warn";

interface StatusView {
  tier: ConnectionTier;
  text: string;
}

const [view, setView] = createSignal<StatusView>({
  tier: "down",
  text: "checking…",
});
const [thinking, setThinking] = createSignal(false);
// Forced-on right after a user submit so the indicator is visible
// immediately, not 5s later when the status poll catches up.
const [clientThinking, setClientThinking] = createSignal(false);
// Consecutive network failures across any chat-side poller. 2+ flips the
// pill to "reconnecting"; 5+ flips it to "offline".
let netFailures = 0;

export { view, thinking };

export function noteNetSuccess(): void {
  netFailures = 0;
}

export function noteNetFailure(): void {
  netFailures++;
  if (netFailures >= 5) {
    setView({ tier: "down", text: "offline" });
  } else if (netFailures >= 2) {
    setView({ tier: "warn", text: "reconnecting…" });
  }
}

export function setClientThinkingNow(visible: boolean): void {
  setClientThinking(visible);
  setThinking(visible);
}

export async function poll(): Promise<void> {
  let status;
  try {
    status = await fetchStatus();
    noteNetSuccess();
  } catch {
    noteNetFailure();
    return;
  }
  if (!status.session) {
    setView({ tier: "down", text: "tmux down" });
  } else if (status.claude) {
    setView({ tier: "alive", text: "Claude" });
  } else {
    setView({ tier: "down", text: `restart Claude (${status.cmd || "?"})` });
  }
  setThinking(clientThinking() || !!status.responding);
}

export async function onStatusPillClick(): Promise<void> {
  if (view().tier !== "down") return;
  setView({ tier: "down", text: "restarting…" });
  await restartClaude();
  setTimeout(() => void poll(), 1500);
}
