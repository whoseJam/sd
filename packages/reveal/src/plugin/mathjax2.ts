import type { RevealApi, RevealPlugin } from "../types";

import { revealBase } from "../config";

interface MathJaxGlobal {
  Hub: {
    Config(options: Record<string, unknown>): void;
    Queue(item: unknown): void;
  };
}

declare const MathJax: MathJaxGlobal;

interface MathJax2Options {
  messageStyle: string;
  tex2jax: {
    inlineMath: string[][];
    skipTags: string[];
    [key: string]: unknown;
  };
  skipStartupTypeset: boolean;
  mathjax?: string;
  config?: string | null;
  [key: string]: unknown;
}

const DEFAULT_OPTIONS: MathJax2Options = {
  messageStyle: "none",
  tex2jax: {
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    skipTags: ["script", "noscript", "style", "textarea", "pre"],
  },
  skipStartupTypeset: true,
  mathjax: `${revealBase}/vendor/MathJax2/MathJax.js`,
};

// "TeX-AMS_SVG"  : Chinese Character Display Error
// "TeX-AMS_HTML" : Full Tested
// "TeX-AMS_CHTML": Not Support Yet
const DEFAULT_CONFIG = "TeX-AMS_CHTML";

function LoadScript(url: string, callback: () => void): void {
  const head = document.querySelector("head");
  if (!head) return;
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  let pending: (() => void) | null = callback;
  script.onload = function () {
    if (pending) {
      pending();
      pending = null;
    }
  };
  head.appendChild(script);
}

export default function MathJax2(): RevealPlugin {
  return {
    id: "MathJax2",
    init: async function (reveal: RevealApi): Promise<unknown> {
      const config = reveal.getConfig();
      const revealOptions = (config.mathjax2 ??
        config.math ??
        {}) as Partial<MathJax2Options>;
      const options: MathJax2Options = { ...DEFAULT_OPTIONS, ...revealOptions };
      const script = options.mathjax;
      if (!script) return;
      const cfg = (options.config as string | undefined) || DEFAULT_CONFIG;
      const url = `${script}?config=${cfg}`;

      options.tex2jax = {
        ...DEFAULT_OPTIONS.tex2jax,
        ...(revealOptions.tex2jax ?? {}),
      };
      options.mathjax = undefined;
      options.config = null;

      return new Promise<number>((resolve) => {
        LoadScript(url, function () {
          MathJax.Hub.Config(options as unknown as Record<string, unknown>);
          MathJax.Hub.Queue([
            "Typeset",
            MathJax.Hub,
            reveal.getRevealElement(),
          ]);
          MathJax.Hub.Queue(() => RenderMathFragment(cfg));
          if (cfg === "TeX-AMS_CHTML")
            MathJax.Hub.Queue(() => MaintainFontSize());
          MathJax.Hub.Queue(() => reveal.layout());
          MathJax.Hub.Queue(() => resolve(0));
        });
      });
    },
  };
}

function RenderMathFragment(config: string): void {
  const math = document.querySelectorAll<HTMLElement>(".math-fragment");
  const render = Renderer[config];
  if (!render) return;
  math.forEach((element) => render(element));
}

function MaintainFontSize(): void {
  const math = document.querySelectorAll<HTMLElement>(
    ".mjx-chtml.MathJax_CHTML",
  );
  math.forEach((element) => {
    element.style.fontSize = "120%";
  });
}

type RendererFn = (math: HTMLElement) => void;

const Renderer: Record<string, RendererFn> = {
  "TeX-AMS_SVG": function (math) {
    const svgRoot = math.querySelector(".MathJax_SVG");
    if (!svgRoot) return;
    const svg = svgRoot.children[0] as HTMLElement | undefined;
    if (!svg) return;
    const a = svg.children[0] as HTMLElement | undefined;
    if (!a) return;
    const b = a.children[0] as HTMLElement | undefined;
    if (!b) return;
    const c = b.children[1] as HTMLElement | undefined;
    if (!c) return;
    AttachFragment(c);
  },
  "TeX-AMS_CHTML": function (math) {
    const span = math.querySelector(".mjx-chtml.MJXc-display");
    if (!span) return;
    const table = span.querySelector(".mjx-table");
    if (!table) return;
    AttachFragment(table);
  },
  "TeX-AMS_HTML": function (math) {
    const span = math.querySelector(".math");
    if (!span) return;
    const a = span.children[0] as HTMLElement | undefined;
    if (!a) return;
    const b = a.children[0] as HTMLElement | undefined;
    if (!b) return;
    const c = b.children[0] as HTMLElement | undefined;
    if (!c) return;
    const d = c.children[0] as HTMLElement | undefined;
    if (!d) return;
    const e = d.children[0] as HTMLElement | undefined;
    if (!e) return;
    const f = e.children[1] as HTMLElement | undefined;
    if (!f) return;
    const g = f.children[0] as HTMLElement | undefined;
    if (!g) return;
    AttachFragment(g);
  },
};

function AttachFragment(rows: Element): void {
  for (let i = 1; i < rows.children.length; i++) {
    rows.children[i].classList.add("fragment");
  }
}
