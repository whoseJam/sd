import { el, escapeHtml } from "./dom.js";
import { renderMarkdown } from "./markdown.js";

const seen = new Set();
// Optimistic user bubbles waiting to be adopted by their server-issued
// twin. Server can deliver the twin via SSE before our POST response
// returns; without this map we'd end up with two bubbles for one prompt.
const pendingOptimistic = new Map();
let lastTs = 0;
let list = null;
let loadingNode = null;

export function initMessages(element) {
  list = element;
}

export function clearMessages() {
  seen.clear();
  pendingOptimistic.clear();
  lastTs = 0;
  loadingNode = null;
  if (list) list.innerHTML = "";
}

export function showLoading(text) {
  if (!list) return;
  clearLoading();
  loadingNode = el("div", { class: "msg-loading" });
  loadingNode.innerHTML =
    '<span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="text"></span>';
  loadingNode.querySelector(".text").textContent = text;
  list.appendChild(loadingNode);
}

export function clearLoading() {
  if (loadingNode) {
    loadingNode.remove();
    loadingNode = null;
  }
}

export function registerOptimistic(optimisticId, text) {
  pendingOptimistic.set(text, optimisticId);
}

export function clearOptimistic(text) {
  pendingOptimistic.delete(text);
}

export function latestTs() {
  return lastTs;
}

// Mark a server-issued id as already-rendered so its replay (via poll
// or JSONL) doesn't duplicate the optimistic bubble we drew on submit.
export function markSeen(id) {
  seen.add(id);
}

// Adopt a server id onto an optimistic bubble: future polls see the same
// id and skip; future text-dedup against this user message still works.
export function adoptServerId(optimisticId, serverId) {
  if (!optimisticId || !serverId) return;
  seen.add(serverId);
  const node = list?.querySelector(`[data-id="${cssEscape(optimisticId)}"]`);
  if (node) node.dataset.id = serverId;
}

export function markFailed(id) {
  const node = list?.querySelector(`[data-id="${cssEscape(id)}"]`);
  if (node) node.classList.add("failed");
}

export function renderMsg(message) {
  if (seen.has(message.id)) return;
  if (
    message.from === "user" &&
    message.text &&
    pendingOptimistic.has(message.text)
  ) {
    const optimisticId = pendingOptimistic.get(message.text);
    pendingOptimistic.delete(message.text);
    adoptServerId(optimisticId, message.id);
    return;
  }
  clearLoading();
  seen.add(message.id);
  if (message.ts > lastTs) lastTs = message.ts;

  let node;
  if (message.from === "system" && message.kind === "tool") {
    node = renderToolChip(message);
  } else {
    node = renderBubble(message);
  }
  node.dataset.id = message.id;
  list.appendChild(node);
}

function cssEscape(value) {
  return String(value).replace(/["\\]/g, "\\$&");
}

function renderToolChip(message) {
  const wrapper = el("div", { class: "tool-wrap" });
  const details = el("details", { class: "tool-chip" });

  const space = message.text.indexOf("  ");
  const summary = el("summary");
  if (space > 0) {
    const tool = message.text.slice(0, space);
    const rest = message.text.slice(space + 2);
    summary.innerHTML =
      '<span class="marker">▸</span><span class="tool-name">' +
      escapeHtml(tool) +
      "</span>  " +
      escapeHtml(rest);
  } else {
    summary.innerHTML =
      '<span class="marker">▸</span>' + escapeHtml(message.text);
  }
  details.appendChild(summary);

  if (message.raw !== undefined && message.raw !== null) {
    const pre = el("pre", { class: "raw" });
    try {
      pre.textContent = JSON.stringify(message.raw, null, 2);
    } catch {
      pre.textContent = String(message.raw);
    }
    details.appendChild(pre);
  }

  wrapper.appendChild(details);

  if (message.images?.length) {
    wrapper.appendChild(renderImages(message.images));
  }
  return wrapper;
}

function renderBubble(message) {
  const row = el("div", { class: "msg " + message.from });
  const bubble = el("div", { class: "bubble" });

  if (message.text) {
    if (message.from === "agent") {
      const html = renderMarkdown(message.text);
      if (html != null) {
        bubble.innerHTML = html;
      } else {
        bubble.textContent = message.text;
      }
    } else {
      bubble.textContent = message.text;
    }
  }

  if (message.images?.length) {
    bubble.appendChild(renderImages(message.images));
  }

  row.appendChild(bubble);
  return row;
}

function renderImages(images) {
  const wrapper = el("div", { class: "images" });
  for (const filename of images) {
    const img = el("img", {
      attrs: { src: "/snapshots/" + filename, loading: "lazy", alt: "" },
      on: {
        click: () => window.open("/snapshots/" + filename, "_blank"),
      },
    });
    wrapper.appendChild(img);
  }
  return wrapper;
}
