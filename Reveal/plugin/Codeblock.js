import { ReplaceElement } from "./Util";

export default function Codeblock() {
    return { id: "codeblock", init };
}

function init(reveal) {
    const elements = document.getElementsByTagName("codeblock");
    if (elements.length === 0) return;

    const element = elements[0];
    const parent = element.parentNode;
    const script = element.querySelector("script");
    let lang = element.getAttribute("lang");
    if (!lang) lang = "cpp";

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    pre.className = element.className;
    code.setAttribute("data-trim", "");
    code.setAttribute("data-line-numbers", "");
    code.setAttribute("class", lang);
    pre.append(code);
    code.append(script);

    ReplaceElement(parent, element, pre);

    init(reveal);
}
