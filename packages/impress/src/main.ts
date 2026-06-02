import "@sd/element";
import "impress.js";

import "impress.js/css/impress-common.css";
import "./impress.css";

declare global {
  interface Window {
    impress: (rootId?: string) => { init: () => void };
  }
}

let initialized = false;

function getLocation(p: string): string {
  p = p.replace("\\", "/");
  const folders = p.split("/").slice(0, -1);
  return folders.join("/");
}

function getLocationFromAncestor(element: Element): string | undefined {
  let node: Node | null = element.parentNode;
  while (node && node instanceof Element) {
    if (node.id === "impress") return undefined;
    const loc = node.getAttribute("location");
    if (loc) return loc;
    node = node.parentNode;
  }
  return undefined;
}

function loadFromURL(
  element: Element,
  url: string,
  allowSecondTry = true,
): void {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState !== 4) return;
    if (this.status === 200) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(this.responseText, "text/html");
      const body = doc.documentElement.children[1];
      const parent = element.parentNode;
      if (!parent) return;
      while (body.children.length > 0) {
        const child = body.children[body.children.length - 1];
        child.setAttribute("location", getLocation(url));
        parent.insertBefore(child, element.nextSibling);
      }
      parent.removeChild(element);
      findIncludeHTMLRequest();
      return;
    } else if (allowSecondTry) {
      const location = getLocationFromAncestor(element);
      if (location) {
        loadFromURL(element, `${location}/${url}`, false);
        return;
      }
    }
    console.warn(`File ${url} Not Found`);
    element.parentNode?.removeChild(element);
    findIncludeHTMLRequest();
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function findIncludeHTMLRequest(): void {
  const elements = document.getElementsByTagName("*");
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const file =
      element.getAttribute("include-html") ??
      element.getAttribute("w3-include-html");
    if (!file) continue;
    loadFromURL(element, file);
    return;
  }
  // No more includes — assign default geometry so a minimal deck (just
  // <div class="step">) still navigates, then init impress.
  assignDefaultGeometry();
  if (initialized) return;
  initialized = true;
  window.impress().init();
}

function assignDefaultGeometry(): void {
  const root = document.getElementById("impress");
  if (!root) return;
  const steps = root.querySelectorAll<HTMLElement>(".step");
  let x = 0;
  steps.forEach((step) => {
    if (
      step.dataset.x === undefined &&
      step.dataset.y === undefined &&
      step.dataset.rotate === undefined &&
      step.dataset.scale === undefined
    ) {
      step.dataset.x = String(x);
      x += 1200;
    }
  });
}

window.addEventListener("load", () => {
  findIncludeHTMLRequest();
});
