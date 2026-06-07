// Chat client entry. Wires up the DOM refs, SSE stream, polling fallbacks,
// status updates, and preview panel. Everything else lives in feature modules.

import { $ } from "./dom.js";
import {
  fetchMessages,
  fetchPreview,
  sendUserMessage,
} from "./api.js";
import { connectSSE } from "./sse.js";
import {
  clearMessages,
  initMessages,
  isNearBottom,
  latestTs,
  renderMsg,
  scrollToBottom,
} from "./messages.js";
import { initSessions, refresh as refreshSessions } from "./sessions.js";
import { initPreview, apply as applyPreview } from "./preview.js";
import { initStatus, poll as pollStatus } from "./status.js";

const messagesEl = $("#messages");
const inputEl = $("#input");
const sendEl = $("#send");

initMessages(messagesEl);

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
  onSwitched: handleSessionSwitched,
});

function handleSessionSwitched() {
  clearMessages();
  let n = 0;
  const tick = async () => {
    await catchUpMessages();
    refreshSessions();
    scrollToBottom();
    if (++n < 20) setTimeout(tick, 500);
  };
  tick();
}

async function catchUpMessages() {
  const wasAtBottom = isNearBottom();
  const since = latestTs();
  const msgs = await fetchMessages(since);
  for (const m of msgs) renderMsg(m);
  if (msgs.length && wasAtBottom) scrollToBottom();
}

async function loadInitialPreview() {
  const j = await fetchPreview();
  if (j) applyPreview(j.preview);
}

const es = connectSSE({
  onMessage(m) {
    const wasAtBottom = isNearBottom();
    renderMsg(m);
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
// SSE doesn't flow through cloudflared quick tunnels — poll regardless.
setInterval(catchUpMessages, 2000);
setInterval(refreshSessions, 5000);
setInterval(loadInitialPreview, 2000);

async function submit() {
  const text = inputEl.value.trim();
  if (!text) return;
  inputEl.value = "";
  inputEl.style.height = "36px";
  sendEl.disabled = true;
  try {
    await sendUserMessage(text);
  } finally {
    sendEl.disabled = false;
    inputEl.focus();
  }
}
sendEl.addEventListener("click", submit);
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    submit();
  }
});
inputEl.addEventListener("input", () => {
  inputEl.style.height = "36px";
  inputEl.style.height = Math.min(inputEl.scrollHeight, 140) + "px";
});
