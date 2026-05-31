// Reveal plugin: drives <sd-animation> elements across slide transitions.
// Each slide that wants an animation embeds `<sd-animation src="...">`; this
// plugin starts the active slide's animations and stops the previous slide's.
import { getLocationFromAncestor } from "../Inject";

export default function SDAnimation() {
  return { id: "SDAnimation", init };
}

function init(reveal) {
  resolveAllSources(reveal.getRevealElement());

  reveal.addEventListener("slidechanged", (event) => {
    const currentSlide = event.currentSlide;
    const previousSlide = event.previousSlide;

    if (previousSlide) {
      for (const el of previousSlide.querySelectorAll("sd-animation")) {
        if (typeof el.stop === "function") el.stop();
      }
    }

    const urls = [];
    for (const el of currentSlide.querySelectorAll("sd-animation")) {
      if (typeof el.show === "function") el.show();
      const src = el.getAttribute("src");
      if (src) urls.push(resolveSrc(src, el));
    }

    if (window.parent) {
      window.parent.postMessage(
        {
          operator: "SlideAnimations",
          arguments: [urls],
        },
        "*",
      );
    }
  });
}

function resolveAllSources(root) {
  if (!root) return;
  for (const el of root.querySelectorAll("sd-animation")) {
    const src = el.getAttribute("src");
    if (!src) continue;
    const resolved = resolveSrc(src, el);
    if (resolved !== src) el.setAttribute("src", resolved);
  }
}

function resolveSrc(src, el) {
  if (src.endsWith(".js")) src = src.replace(/\.js$/, ".html");
  if (
    src.startsWith("./animation") ||
    src.startsWith("http") ||
    src.startsWith("animation")
  )
    return src;
  const location = getLocationFromAncestor(el);
  if (location) return location + "/" + src;
  return src;
}
