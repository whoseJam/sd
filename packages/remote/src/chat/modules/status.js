// Header status pill (Claude alive / down) + typing indicator. Both driven
// off /api/status which we poll every 5s; SSE doesn't broadcast status
// transitions because they're derived from tmux/pane state.

import { fetchStatus, restartClaude } from "./api.js";

let pillEl, pillTextEl, typingEl;

export function initStatus(refs) {
  pillEl = refs.pill;
  pillTextEl = refs.pillText;
  typingEl = refs.typing;

  pillEl.addEventListener("click", async () => {
    if (!pillEl.classList.contains("down")) return;
    pillTextEl.textContent = "restarting…";
    await restartClaude();
    setTimeout(poll, 1500);
  });
}

export async function poll() {
  const s = await fetchStatus();
  if (!s) return;
  if (!s.session) {
    pillEl.className = "status-pill down";
    pillTextEl.textContent = "tmux down";
  } else if (s.claude) {
    pillEl.className = "status-pill alive";
    pillTextEl.textContent = "Claude";
  } else {
    pillEl.className = "status-pill down";
    pillTextEl.textContent = `restart Claude (${s.cmd || "?"})`;
  }
  if (typingEl) typingEl.classList.toggle("show", !!s.responding);
}
