// Stage panel state machine.
//
// Server holds the canonical "currently displayed URL". Client tracks an
// additional "minimized" flag that's per-client (so one phone minimizing
// doesn't affect another). When the server URL changes, we reset minimized
// to false — a new stage announcement is meant to be seen.

import { setPreview } from "./api.js";

let panelEl, iframeEl, labelEl, pillEl, pillLabelEl;
let current = null;
let minimized = false;

export function initStage(refs) {
  panelEl = refs.panel;
  iframeEl = refs.iframe;
  labelEl = refs.label;
  pillEl = refs.pill;
  pillLabelEl = refs.pillLabel;

  refs.minimize.addEventListener("click", (e) => {
    e.stopPropagation();
    minimized = true;
    apply(current);
  });
  refs.close.addEventListener("click", async (e) => {
    e.stopPropagation();
    await setPreview("", "");
    // server SSE will broadcast the cleared state back to us
  });
  pillEl.addEventListener("click", () => {
    minimized = false;
    apply(current);
  });
  pillEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      minimized = false;
      apply(current);
    }
  });
}

export function apply(p) {
  const newUrl = (p && p.url) || "";
  const oldUrl = (current && current.url) || "";

  if (newUrl !== oldUrl) {
    // Auto-expand the panel on desktop where there's room; on mobile the
    // iframe taking 50vh on first arrival is overwhelming, so we land at
    // the pill state and let the user tap to expand.
    minimized = isMobile();
    if (newUrl) {
      iframeEl.src = newUrl;
      labelEl.textContent = (p && p.label) || newUrl;
      pillLabelEl.textContent = (p && p.label) || "preview";
    }
  }
  current = p;

  const hasUrl = !!newUrl;
  if (hasUrl && !minimized) {
    panelEl.classList.add("show");
    pillEl.classList.remove("show");
  } else if (hasUrl && minimized) {
    panelEl.classList.remove("show");
    pillEl.classList.add("show");
  } else {
    panelEl.classList.remove("show");
    pillEl.classList.remove("show");
    setTimeout(() => {
      if (!current || !current.url) iframeEl.src = "about:blank";
    }, 240);
  }
}

function isMobile() {
  return window.matchMedia("(max-width: 899px)").matches;
}
