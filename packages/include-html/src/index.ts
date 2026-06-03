// Resolves every <element include-html="./path.html"> on the page by fetching
// the referenced HTML and inlining its body. Each included subtree carries a
// `location` attribute so nested includes can resolve relative paths by walking
// up to the nearest ancestor that knows where it came from (stopping at the
// host framework's root element identified by `rootId`).

export interface IncludeHTMLOptions {
  rootId: string;
}

export function getLocationFromAncestor(
  element: Element,
  rootId: string,
): string | undefined {
  let node: Node | null = element.parentNode;
  while (node && node instanceof Element) {
    if (node.id === rootId) return undefined;
    const ancestorLocation = node.getAttribute("location");
    if (ancestorLocation) return ancestorLocation;
    node = node.parentNode;
  }
  return undefined;
}

export function includeHTML(options: IncludeHTMLOptions): Promise<void> {
  const { rootId } = options;

  function getLocation(urlPath: string): string {
    urlPath = urlPath.replace("\\", "/");
    return urlPath.split("/").slice(0, -1).join("/");
  }

  return new Promise((resolve) => {
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
          step();
          return;
        }
        if (allowSecondTry) {
          const ancestorLocation = getLocationFromAncestor(element, rootId);
          if (ancestorLocation) {
            loadFromURL(element, `${ancestorLocation}/${url}`, false);
            return;
          }
        }
        console.warn(`File ${url} Not Found`);
        element.parentNode?.removeChild(element);
        step();
      };
      xhttp.open("GET", url, true);
      xhttp.send();
    }

    function step(): void {
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
      resolve();
    }

    step();
  });
}
