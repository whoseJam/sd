import Highlight from "@whosejam/sd-assets/HighlightEngine.js";
import Reveal from "reveal.js";
import "@whosejam/sd-element";

import type { RevealPlugin } from "./types";

import Codeblock from "./plugin/codeblock";
import Image from "./plugin/image";
import MathJax2 from "./plugin/mathjax2";
import Picture from "./plugin/picture";

declare global {
  interface Window {
    MyRevealCallback?: () => void;
    Reveal?: typeof Reveal;
  }
}

window.Reveal = Reveal;

const plugins: RevealPlugin[] = [
  Image(),
  Picture(),
  MathJax2(),
  Codeblock(),
  Highlight(),
];

window.MyRevealCallback = function (): void {
  Reveal.initialize({
    controls: true,
    progress: true,
    center: true,
    hash: true,
    plugins,
  });
};
