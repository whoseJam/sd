// Preview panel state machine.
//
// Server holds the canonical "currently displayed URL". Client tracks an
// additional "minimized" flag that's per-client (so one phone minimizing
// doesn't affect another). When the server URL changes, we reset minimized
// to false — a new preview announcement is meant to be seen.

let panelEl, iframeEl, labelEl, pillEl, pillLabelEl;
let current = null;
let minimized = false;

export function initPreview(refs) {
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
  // rescale runs after every state change so any inline panel height /
  // iframe transform left over from a previous expanded state always
  // gets cleared when we collapse back to the pill.
  requestAnimationFrame(rescale);
}

function isMobile() {
  return window.matchMedia("(max-width: 899px)").matches;
}

/** Mobile only: iframe is pinned to 960×720 in CSS, we scale it down with
 *  transform to fit the panel and shrink the panel to the scaled height.
 *  Outside of mobile-show state, clear any inline styles so the static
 *  CSS takes over (and the panel collapses cleanly on minimize). */
function rescale() {
  if (!iframeEl) return;
  if (!isMobile() || !panelEl.classList.contains("show")) {
    iframeEl.style.transform = "";
    panelEl.style.height = "";
    return;
  }
  const w = panelEl.clientWidth;
  const s = w / 960;
  iframeEl.style.transform = `scale(${s})`;
  panelEl.style.height = `${720 * s}px`;
}

window.addEventListener("resize", () => requestAnimationFrame(rescale));
