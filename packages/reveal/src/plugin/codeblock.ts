import type { RevealApi, RevealPlugin } from "../types";

import { ReplaceElement } from "./util";

export default function Codeblock(): RevealPlugin {
  return { id: "codeblock", init };
}

function init(reveal: RevealApi): void {
  const elements = document.getElementsByTagName("codeblock");
  if (elements.length === 0) return;

  const element = elements[0] as HTMLElement;
  const script = element.querySelector("script");
  const fontSize = element.style.fontSize;
  const lang = element.getAttribute("lang") || "cpp";
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  pre.className = element.className;
  code.setAttribute("data-trim", "");
  code.setAttribute("data-line-numbers", "");
  code.setAttribute("class", lang);
  if (fontSize) code.style.fontSize = fontSize;
  pre.append(code);
  if (script) code.append(script);

  ReplaceElement(element, pre);

  init(reveal);
}
