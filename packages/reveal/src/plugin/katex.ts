import type { RevealApi, RevealPlugin } from "../types";

declare function renderMathInElement(
  element: Element,
  options: Record<string, unknown>,
): void;

interface KaTeXOptions {
  version: string;
  delimiters: Array<{ left: string; right: string; display: boolean }>;
  ignoredTags: string[];
  local?: string;
  extensions?: string[];
  [key: string]: unknown;
}

export const KaTeX = (): RevealPlugin => {
  let deck: RevealApi;

  const defaultOptions: KaTeXOptions = {
    version: "latest",
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true },
    ],
    ignoredTags: ["script", "noscript", "style", "textarea", "pre"],
  };

  const loadCss = (src: string): void => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = src;
    document.head.appendChild(link);
  };

  const loadScript = (src: string): Promise<void> =>
    new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.onload = () => resolve();
      script.onerror = reject;
      script.src = src;
      document.head.append(script);
    });

  async function loadScripts(urls: string[]): Promise<void> {
    for (const url of urls) {
      await loadScript(url);
    }
  }

  return {
    id: "katex",

    init: function (reveal: RevealApi): void {
      deck = reveal;

      const revealOptions = (deck.getConfig().katex ??
        {}) as Partial<KaTeXOptions>;
      const options: KaTeXOptions = { ...defaultOptions, ...revealOptions };
      // Strip script-loader-only fields before passing the rest to katex.
      const katexOptions: Record<string, unknown> = { ...options };
      delete katexOptions.local;
      delete katexOptions.version;
      delete katexOptions.extensions;

      const baseUrl = options.local ?? "https://cdn.jsdelivr.net/npm/katex";
      const versionString = options.local ? "" : `@${options.version}`;

      const cssUrl = `${baseUrl + versionString}/dist/katex.min.css`;
      const katexUrl = `${baseUrl + versionString}/dist/katex.min.js`;
      const mhchemUrl = `${baseUrl + versionString}/dist/contrib/mhchem.min.js`;
      const karUrl = `${baseUrl + versionString}/dist/contrib/auto-render.min.js`;

      const katexScripts = [katexUrl];
      if (options.extensions?.includes("mhchem")) {
        katexScripts.push(mhchemUrl);
      }
      katexScripts.push(karUrl);

      const renderMath = (): void => {
        renderMathInElement(reveal.getSlidesElement(), katexOptions);
        const elements = document.querySelectorAll<HTMLElement>(
          ".math-fragment .katex-html",
        );
        elements.forEach((math) => renderMathFragment(math));
        deck.layout();
      };

      loadCss(cssUrl);

      loadScripts(katexScripts).then(() => {
        if (deck.isReady()) {
          renderMath();
        } else {
          deck.on("ready", renderMath);
        }
      });
    },
  };
};

function renderMathFragment(math: HTMLElement): void {
  const children = [...math.children];
  if (children.length >= 2) {
    for (let l = 0, r: number; l < children.length; l = r + 1) {
      const container = document.createElement("div");
      if (l > 0) {
        container.setAttribute("class", "fragment");
      }
      r = l;
      while (
        r + 1 < children.length &&
        !children[r + 1].classList.contains("newline")
      ) {
        r++;
      }
      for (let i = l; i <= r; i++) {
        container.appendChild(children[i]);
      }
      math.appendChild(container);
    }
  } else if (children.length === 1) {
    const parent = math.querySelectorAll(
      ".mord > .mtable > .col-align-l > .vlist-t > .vlist-r > .vlist",
    )[0];
    if (parent) {
      for (let i = 1; i < parent.children.length; i++) {
        parent.children[i].setAttribute("class", "fragment");
      }
    }
  }
}
