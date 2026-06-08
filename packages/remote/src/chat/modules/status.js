import { fetchStatus, restartClaude } from "./api.js";

let pill, pillText, typing;
// Forced-on by app.js right after a user submit so the indicator is
// visible immediately, not 5s later when the status poll catches up.
let clientThinking = false;
// Consecutive network failures across any chat-side poller. 2+ flips the
// pill to "reconnecting"; 5+ flips it to "offline".
let netFailures = 0;

export function initStatus(refs) {
  pill = refs.pill;
  pillText = refs.pillText;
  typing = refs.typing;

  pill.addEventListener("click", async () => {
    if (!pill.classList.contains("down")) return;
    pillText.textContent = "restarting…";
    try {
      await restartClaude();
    } catch {}
    setTimeout(poll, 1500);
  });
}

export function setThinking(visible) {
  clientThinking = !!visible;
  if (typing) typing.classList.toggle("show", clientThinking);
}

export function noteNetSuccess() {
  netFailures = 0;
}

export function noteNetFailure() {
  netFailures++;
  applyConnectionState();
}

export async function poll() {
  let status;
  try {
    status = await fetchStatus();
    noteNetSuccess();
  } catch {
    noteNetFailure();
    return;
  }
  if (!status.session) {
    pill.className = "status-pill down";
    pillText.textContent = "tmux down";
  } else if (status.claude) {
    pill.className = "status-pill alive";
    pillText.textContent = "Claude";
  } else {
    pill.className = "status-pill down";
    pillText.textContent = `restart Claude (${status.cmd || "?"})`;
  }
  if (typing) {
    typing.classList.toggle("show", clientThinking || !!status.responding);
  }
}

function applyConnectionState() {
  if (netFailures >= 5) {
    pill.className = "status-pill down";
    pillText.textContent = "offline";
  } else if (netFailures >= 2) {
    pill.className = "status-pill warn";
    pillText.textContent = "reconnecting…";
  }
}
