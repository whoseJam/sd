import "@sd/element";

import "./plain.css";

function getLocation(p: string): string {
  p = p.replace("\\", "/");
  const folders = p.split("/").slice(0, -1);
  return folders.join("/");
}

function getLocationFromAncestor(element: Element): string | undefined {
  let node: Node | null = element.parentNode;
  while (node && node instanceof Element) {
    if (node.id === "slide-host") return undefined;
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
}

window.addEventListener("load", () => {
  findIncludeHTMLRequest();
});
