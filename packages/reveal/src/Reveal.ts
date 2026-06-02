import Highlight from "@sd/assets/HighlightEngine.js";
import Reveal from "reveal.js";
import "@sd/element";

import type { RevealPlugin } from "./types";

import Codeblock from "./plugin/Codeblock";
import Image from "./plugin/Image";
import MathJax2 from "./plugin/MathJax2";
import Picture from "./plugin/Picture";

declare global {
  interface Window {
    MyRevealCallback?: () => void;
  }
}

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
