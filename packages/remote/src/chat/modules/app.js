// Chat client entry. Wires DOM refs + SSE + polling + sub-modules.

import { $ } from "./dom.js";
import {
  fetchMessages,
  fetchPreview,
  sendUserMessage,
} from "./api.js";
import { connectSSE } from "./sse.js";
import {
  adoptServerId,
  clearLoading,
  clearMessages,
  clearOptimistic,
  initMessages,
  isNearBottom,
  latestTs,
  markFailed,
  registerOptimistic,
  renderMsg,
  scrollToBottom,
  showLoading,
} from "./messages.js";
import { initSessions, refresh as refreshSessions } from "./sessions.js";
import { initPreview, apply as applyPreview } from "./preview.js";
import {
  initStatus,
  noteNetFailure,
  noteNetSuccess,
  poll as pollStatus,
  setThinking,
} from "./status.js";

const messages = $("#messages");
const input = $("#input");
const send = $("#send");

initMessages(messages);

initStatus({
  pill: $("#status"),
  pillText: $("#status-text"),
  typing: $("#typing"),
});

initPreview({
  panel: $("#preview"),
  iframe: $("#preview-iframe"),
  label: $("#preview-label"),
  pill: $("#preview-pill"),
  pillLabel: $("#preview-pill-label"),
  minimize: $("#preview-minimize"),
});

initSessions({
  picker: $("#session-picker"),
  title: $("#session-title"),
  menu: $("#session-menu"),
  new: $("#session-new"),
  list: $("#session-list"),
  onSwitching: handleSessionSwitching,
  onSwitched: handleSessionSwitched,
});

function handleSessionSwitching(title) {
  clearMessages();
  showLoading(`loading ${title}`);
}

function handleSessionSwitched(title) {
  // Server has accepted the switch; watcher is replaying the new JSONL.
  // Loading row is already on screen from handleSessionSwitching — it
  // gets cleared automatically when the first real message renders.
  void title;
  let attempt = 0;
  const tick = async () => {
    await catchUpMessages();
    refreshSessions();
    scrollToBottom();
    if (++attempt < 20) setTimeout(tick, 500);
    else clearLoading();
  };
  tick();
}

async function catchUpMessages() {
  const wasAtBottom = isNearBottom();
  let newMessages;
  try {
    newMessages = await fetchMessages(latestTs());
    noteNetSuccess();
  } catch {
    noteNetFailure();
    return;
  }
  let sawAgentContent = false;
  for (const message of newMessages) {
    renderMsg(message);
    if (
      message.from === "agent" &&
      (message.text || message.images?.length)
    ) {
      sawAgentContent = true;
    }
  }
  if (sawAgentContent) setThinking(false);
  if (newMessages.length && wasAtBottom) scrollToBottom();
}

async function loadInitialPreview() {
  const response = await fetchPreview();
  if (response) applyPreview(response.preview);
}

connectSSE({
  onMessage(message) {
    const wasAtBottom = isNearBottom();
    renderMsg(message);
    if (message.from === "agent" && (message.text || message.images?.length)) {
      setThinking(false);
    }
    if (wasAtBottom) scrollToBottom();
  },
  onReconnect() {
    catchUpMessages();
    loadInitialPreview();
    pollStatus();
  },
});

catchUpMessages().then(scrollToBottom);
loadInitialPreview();
pollStatus();
setInterval(pollStatus, 5000);
// SSE is swallowed by cloudflared quick tunnels — poll regardless.
setInterval(catchUpMessages, 2000);
setInterval(refreshSessions, 5000);
setInterval(loadInitialPreview, 2000);

async function submit() {
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  input.style.height = "36px";

  const optimisticId = `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  renderMsg({
    id: optimisticId,
    ts: Date.now(),
    from: "user",
    text,
  });
  registerOptimistic(optimisticId, text);
  scrollToBottom();
  setThinking(true);

  send.disabled = true;
  try {
    const reply = await sendUserMessage(text);
    if (reply?.id) {
      clearOptimistic(text);
      adoptServerId(optimisticId, reply.id);
    }
  } catch {
    clearOptimistic(text);
    markFailed(optimisticId);
    setThinking(false);
  } finally {
    send.disabled = false;
    input.focus();
  }
}
send.addEventListener("click", submit);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    submit();
  }
});
input.addEventListener("input", () => {
  input.style.height = "36px";
  input.style.height = Math.min(input.scrollHeight, 140) + "px";
});
