import type { RevealApi, RevealPlugin, SlideChangedEvent } from "../types";

import { getLocationFromAncestor } from "../include";

export default function Image(): RevealPlugin {
  return { id: "image", init };
}

function init(reveal: RevealApi): void {
  reveal.addEventListener("slidechanged", (event: SlideChangedEvent) => {
    const images = event.currentSlide.getElementsByTagName("img");
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const url = getURL(image);
      if (url) image.setAttribute("src", url);
    }
    // TODO wait for all images to finish loading before relayout.
    if (images.length >= 1) {
      setTimeout(() => reveal.layout(), 50);
    }
  });
}

function getURL(image: HTMLImageElement): string | undefined {
  const url = image.getAttribute("data-source");
  if (!url) return undefined;
  if (
    url.startsWith("./image") ||
    url.startsWith("http") ||
    url.startsWith("image")
  ) {
    return url;
  }
  const base = getLocationFromAncestor(image);
  return base ? `${base}/${url}` : url;
}
