// Chat client entry. Wires up the DOM refs, SSE stream, polling fallbacks,
// status updates, and stage panel. Everything else lives in feature modules.

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
import { initStage, apply as applyStage } from "./stage.js";
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

initStage({
  panel: $("#stage"),
  iframe: $("#stage-iframe"),
  label: $("#stage-label"),
  pill: $("#stage-pill"),
  pillLabel: $("#stage-pill-label"),
  minimize: $("#stage-minimize"),
  close: $("#stage-close"),
});

initSessions({
  picker: $("#session-picker"),
  title: $("#session-title"),
  menu: $("#session-menu"),
  new: $("#session-new"),
  list: $("#session-list"),
});

async function catchUpMessages() {
  const wasAtBottom = isNearBottom();
  const since = latestTs();
  const msgs = await fetchMessages(since);
  for (const m of msgs) renderMsg(m);
  if (msgs.length && wasAtBottom) scrollToBottom();
}

async function loadInitialPreview() {
  const j = await fetchPreview();
  if (j) applyStage(j.preview);
}

// SSE: live updates. Polling is a 30s backup in case SSE silently dies
// behind a proxy. On (re)connect we also catch up via /api/messages.
const es = connectSSE({
  onMessage(m) {
    const wasAtBottom = isNearBottom();
    renderMsg(m);
    if (wasAtBottom) scrollToBottom();
  },
  onPreview(j) {
    applyStage(j.preview);
  },
  onSessionChanged() {
    // New session pinned server-side: wipe chat, refetch (server is
    // already replaying the new JSONL into the cache).
    clearMessages();
    refreshSessions();
    catchUpMessages().then(scrollToBottom);
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
setInterval(catchUpMessages, es ? 30000 : 3000);

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
