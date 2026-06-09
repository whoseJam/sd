// Preview panel: shows a deck/animation iframe; can be minimized to a pill.

let panel, iframe, label, pill, pillLabel;
let overlay, overlayRows;
let current = null;
let minimized = false;
const progress = new Map();

export function initPreview(refs) {
  panel = refs.panel;
  iframe = refs.iframe;
  label = refs.label;
  pill = refs.pill;
  pillLabel = refs.pillLabel;
  overlay = refs.overlay;
  overlayRows = refs.overlayRows;

  refs.minimize.addEventListener("click", (event) => {
    event.stopPropagation();
    minimized = true;
    apply(current);
  });
  pill.addEventListener("click", () => {
    minimized = false;
    apply(current);
  });
  pill.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      minimized = false;
      apply(current);
    }
  });

  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.source !== "sd-loader") return;
    handleLoaderMessage(data);
  });
}

function handleLoaderMessage(data) {
  if (data.type === "ready") {
    hideOverlay();
    return;
  }
  if (data.type === "error") {
    renderOverlayError(`加载失败: ${data.message || "unknown"}`);
    return;
  }
  if (data.type === "start") {
    if (!progress.has(data.name)) progress.set(data.name, { loaded: 0, total: 0 });
    showOverlay();
    renderOverlay();
    return;
  }
  if (data.type === "progress" || data.type === "done") {
    const entry = progress.get(data.name) || { loaded: 0, total: 0 };
    if (typeof data.loaded === "number") entry.loaded = data.loaded;
    if (typeof data.total === "number" && data.total > 0) {
      entry.total = data.total;
      if (data.type === "done" && typeof data.loaded !== "number") entry.loaded = data.total;
    }
    entry.done = data.type === "done";
    progress.set(data.name, entry);
    renderOverlay();
  }
}

function showOverlay() {
  if (!overlay) return;
  overlay.classList.add("show");
}

function hideOverlay() {
  if (!overlay) return;
  overlay.classList.remove("show");
  progress.clear();
  if (overlayRows) overlayRows.innerHTML = "";
}

function renderOverlay() {
  if (!overlayRows) return;
  overlayRows.innerHTML = "";
  for (const [name, entry] of progress) {
    overlayRows.appendChild(createProgressRow(name, entry));
  }
}

function renderOverlayError(message) {
  showOverlay();
  if (!overlayRows) return;
  overlayRows.innerHTML = "";
  const row = document.createElement("div");
  row.className = "progress-row error";
  const text = document.createElement("div");
  text.className = "progress-head";
  text.textContent = message;
  row.appendChild(text);
  overlayRows.appendChild(row);
}

function createProgressRow(name, entry) {
  const row = document.createElement("div");
  row.className = "progress-row";
  if (entry.done) row.classList.add("done");

  const head = document.createElement("div");
  head.className = "progress-head";

  const resource = document.createElement("span");
  resource.className = "resource-name";
  resource.textContent = name;

  const value = document.createElement("span");
  value.className = "progress-value";
  value.textContent = formatProgress(entry);

  const bar = document.createElement("div");
  bar.className = "progress-bar";

  const fill = document.createElement("div");
  fill.className = "progress-fill";
  fill.style.width = `${progressPercent(entry)}%`;

  head.append(resource, value);
  bar.appendChild(fill);
  row.append(head, bar);
  return row;
}

function formatProgress(entry) {
  if (!entry.total) {
    return entry.loaded ? formatBytes(entry.loaded) : "waiting";
  }
  return `${progressPercent(entry)}% · ${formatBytes(entry.loaded)}/${formatBytes(entry.total)}`;
}

function progressPercent(entry) {
  if (!entry.total) return 0;
  return Math.min(100, Math.round((entry.loaded / entry.total) * 100));
}

function formatBytes(n) {
  if (n < 1024) return `${n}B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)}K`;
  return `${(n / 1024 / 1024).toFixed(1)}M`;
}

export function apply(preview) {
  const newUrl = (preview && preview.url) || "";
  const oldUrl = (current && current.url) || "";

  if (newUrl !== oldUrl) {
    minimized = isMobile();
    progress.clear();
    if (overlay) overlay.classList.remove("show");
    if (newUrl) {
      iframe.src = newUrl;
      label.textContent = (preview && preview.label) || newUrl;
      pillLabel.textContent = (preview && preview.label) || "preview";
    }
  }
  current = preview;

  const hasUrl = !!newUrl;
  if (hasUrl && !minimized) {
    panel.classList.add("show");
    pill.classList.remove("show");
  } else if (hasUrl && minimized) {
    panel.classList.remove("show");
    pill.classList.add("show");
  } else {
    panel.classList.remove("show");
    pill.classList.remove("show");
    setTimeout(() => {
      if (!current || !current.url) iframe.src = "about:blank";
    }, 240);
  }
  // Always rescale so leftover inline width/transform from a prior expanded
  // state gets cleared on minimize.
  requestAnimationFrame(rescale);
}

function isMobile() {
  return window.matchMedia("(max-width: 899px)").matches;
}

// reveal.js layout() throws on narrow viewports — pin the iframe to a fixed
// 960×720 internal viewport (CSS) and scale it with transform to fit.
function rescale() {
  if (!iframe) return;
  if (!isMobile() || !panel.classList.contains("show")) {
    iframe.style.transform = "";
    panel.style.height = "";
    return;
  }
  const scale = panel.clientWidth / 960;
  iframe.style.transform = `scale(${scale})`;
  panel.style.height = `${720 * scale}px`;
}

window.addEventListener("resize", () => requestAnimationFrame(rescale));
