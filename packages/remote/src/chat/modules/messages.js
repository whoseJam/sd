// Message list rendering. Append-only; each Message ID is deduped via a Set.
// Auto-scroll only when the user is already near the bottom (don't yank them
// down if they're scrolled up reading history).

import { el, escapeHtml } from "./dom.js";
import { renderMarkdown } from "./markdown.js";

const seen = new Set();
let lastTs = 0;
let listEl = null;

export function initMessages(el) {
  listEl = el;
}

/** Wipe the chat: used when switching sessions so the next render starts
 *  empty before the new session's history streams in. */
export function clearMessages() {
  seen.clear();
  lastTs = 0;
  if (listEl) listEl.innerHTML = "";
}

export function latestTs() {
  return lastTs;
}

export function isNearBottom() {
  if (!listEl) return true;
  return listEl.scrollTop + listEl.clientHeight >= listEl.scrollHeight - 80;
}

export function scrollToBottom() {
  if (listEl) listEl.scrollTop = listEl.scrollHeight;
}

export function renderMsg(m) {
  if (seen.has(m.id)) return;
  seen.add(m.id);
  if (m.ts > lastTs) lastTs = m.ts;

  if (m.from === "system" && m.kind === "tool") {
    listEl.appendChild(renderToolChip(m));
    return;
  }
  listEl.appendChild(renderBubble(m));
}

function renderToolChip(m) {
  const wrap = el("div", { class: "tool-wrap" });
  const det = el("details", { class: "tool-chip" });

  const space = m.text.indexOf("  ");
  const summary = el("summary");
  if (space > 0) {
    const tool = m.text.slice(0, space);
    const rest = m.text.slice(space + 2);
    summary.innerHTML =
      '<span class="marker">▸</span><span class="tool-name">' +
      escapeHtml(tool) +
      "</span>  " +
      escapeHtml(rest);
  } else {
    summary.innerHTML =
      '<span class="marker">▸</span>' + escapeHtml(m.text);
  }
  det.appendChild(summary);

  if (m.raw !== undefined && m.raw !== null) {
    const pre = el("pre", { class: "raw" });
    try {
      pre.textContent = JSON.stringify(m.raw, null, 2);
    } catch {
      pre.textContent = String(m.raw);
    }
    det.appendChild(pre);
  }

  wrap.appendChild(det);

  if (m.images?.length) {
    wrap.appendChild(renderImages(m.images));
  }
  return wrap;
}

function renderBubble(m) {
  const row = el("div", { class: "msg " + m.from });
  const bubble = el("div", { class: "bubble" });

  if (m.text) {
    if (m.from === "agent") {
      const html = renderMarkdown(m.text);
      if (html != null) {
        bubble.innerHTML = html;
      } else {
        bubble.textContent = m.text;
      }
    } else {
      bubble.textContent = m.text;
    }
  }

  if (m.images?.length) {
    bubble.appendChild(renderImages(m.images));
  }

  row.appendChild(bubble);
  return row;
}

function renderImages(images) {
  const wrap = el("div", { class: "images" });
  for (const f of images) {
    const img = el("img", {
      attrs: { src: "/snapshots/" + f, loading: "lazy", alt: "" },
      on: {
        click: () => window.open("/snapshots/" + f, "_blank"),
      },
    });
    wrap.appendChild(img);
  }
  return wrap;
}
