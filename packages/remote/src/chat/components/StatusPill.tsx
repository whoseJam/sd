import { onStatusPillClick, view } from "../stores/status";

export function StatusPill() {
  return (
    <button
      class="status-pill"
      classList={{
        alive: view().tier === "alive",
        down: view().tier === "down",
        warn: view().tier === "warn",
      }}
      type="button"
      onClick={() => void onStatusPillClick()}
    >
      <span class="dot" />
      <span>{view().text}</span>
    </button>
  );
}
