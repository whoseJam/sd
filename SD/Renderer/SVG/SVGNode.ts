import { Action } from "@/Animate/Action";
import { Dom } from "@/Dom/Dom";
import { svg } from "@/Interact/Root";
import { RenderNode, SVGLabel } from "@/Renderer/RenderNode";
import { SDNode } from "@/sd";

const innerHTMLKey = new Set(["innerHTML", "text"]);
const styleKey = new Set(["pointer-events", "min-width", "min-height", "display"]);
const shapeKey = new Set(["circle", "ellipse", "foreignObject", "fragment", "image", "line", "path", "rect", "svg", "text", "polygon", "polyline"]);

function moveTo(element: SVGNode) {
    return function (t: number) {
        if (t !== 1) return;
        this.target.__append(element);
    };
}

function parseText(text: string) {
    let ans = "";
    text = String(text);
    for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") ans += "&emsp;";
        else if (text[i] === "<") ans += "&lt;";
        else if (text[i] === ">") ans += "&gt;";
        else ans += text[i];
    }
    return ans;
}

export class SVGNode extends RenderNode {
    declare element: SVGElement;
    declare class: typeof SVGNode;
    constructor(parent: SDNode, render: RenderNode, element: string | SVGElement) {
        if (typeof element === "string") {
            super(parent, render, element);
            this.element = Dom.createSVGElement(element === "view" ? "svg" : element);
            this.appear();
        } else {
            super(parent, render, Dom.tagName(element));
            this.element = element;
            if (this.render) this.appear();
        }
        this.class = SVGNode;
    }
    moveTo(render: RenderNode): void {
        if (!SVGLabel.has(render.label)) return this.moveTo(svg());
        if (this.render === render) return;
        const t = this.parent.delay() + this.parent.duration();
        new Action(t, t, this.render, render, moveTo(this), this, "moveTo");
        this.render = render;
    }
    getAttribute(key: string) {
        if (innerHTMLKey.has(key)) {
            return this.element.innerHTML;
        } else if (styleKey.has(key)) {
            return this.element.style[key];
        }
        return this.element.getAttribute(key);
    }
    setAttribute(key: string, value: any): void {
        if (typeof value.r === "number" && typeof value.g === "number" && typeof value.b === "number") value = `rgb(${value.r}, ${value.g}, ${value.b})`;
        if (innerHTMLKey.has(key)) {
            if (key === "text") value = parseText(value);
            this.element.innerHTML = value;
        } else if (styleKey.has(key)) {
            this.element.style[key] = value;
        } else if (key === "viewBox" && typeof value === "object") {
            this.element.setAttribute(key, `${value.x} ${value.y} ${value.width} ${value.height}`);
        } else {
            this.element.setAttribute(key, value);
        }
    }
    hasShape() {
        return shapeKey.has(this.label);
    }
}
