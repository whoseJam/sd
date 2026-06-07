// Auto-scroll only when the user is already near the bottom — don't yank
// them down if they're scrolled up reading history.

import { el, escapeHtml } from "./dom.js";
import { renderMarkdown } from "./markdown.js";

const seen = new Set();
let lastTs = 0;
let list = null;

export function initMessages(element) {
  list = element;
}

export function clearMessages() {
  seen.clear();
  lastTs = 0;
  if (list) list.innerHTML = "";
}

export function latestTs() {
  return lastTs;
}

export function isNearBottom() {
  if (!list) return true;
  return list.scrollTop + list.clientHeight >= list.scrollHeight - 80;
}

export function scrollToBottom() {
  if (list) list.scrollTop = list.scrollHeight;
}

export function renderMsg(message) {
  if (seen.has(message.id)) return;
  seen.add(message.id);
  if (message.ts > lastTs) lastTs = message.ts;

  if (message.from === "system" && message.kind === "tool") {
    list.appendChild(renderToolChip(message));
    return;
  }
  list.appendChild(renderBubble(message));
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
