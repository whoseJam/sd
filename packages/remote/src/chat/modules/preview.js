// Preview panel: shows a deck/animation iframe; can be minimized to a pill.

let panel, iframe, label, pill, pillLabel;
let current = null;
let minimized = false;

export function initPreview(refs) {
  panel = refs.panel;
  iframe = refs.iframe;
  label = refs.label;
  pill = refs.pill;
  pillLabel = refs.pillLabel;

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
}

export function apply(preview) {
  const newUrl = (preview && preview.url) || "";
  const oldUrl = (current && current.url) || "";

  if (newUrl !== oldUrl) {
    // Mobile lands on the pill (a 50vh iframe is too much on first arrival).
    minimized = isMobile();
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
