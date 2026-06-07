import { fetchStatus, restartClaude } from "./api.js";

let pill, pillText, typing;

export function initStatus(refs) {
  pill = refs.pill;
  pillText = refs.pillText;
  typing = refs.typing;

  pill.addEventListener("click", async () => {
    if (!pill.classList.contains("down")) return;
    pillText.textContent = "restarting…";
    await restartClaude();
    setTimeout(poll, 1500);
  });
}

export async function poll() {
  const status = await fetchStatus();
  if (!status) return;
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
  if (typing) typing.classList.toggle("show", !!status.responding);
}
