import { Action } from "@/Animate/Action";
import { Dom } from "@/Dom/Dom";
import { div } from "@/Interact/Root";
import { HTMLLabel, RenderNode } from "@/Renderer/RenderNode";
import { SDNode } from "@/sd";

const innerHTMLKey = new Set(["innerHTML", "text"]);
const styleKey = new Set(["position", "left", "top", "pointer-events", "width", "height", "border", "overflow", "transform", "opacity", "display", "min-width", "min-height", "white-space", "background-color", "color", "border-color", "border-style", "border-width", "border-radius", "aspect-ratio", "object-fit"]);
const callbackKey = new Set(["onclick", "onchange"]);

function moveTo(element: HTMLNode) {
    return function (t: number) {
        if (t !== 1) return;
        this.target.__append(element);
    };
}

export class HTMLNode extends RenderNode {
    declare element: HTMLElement;
    class: typeof HTMLNode;
    constructor(parent: SDNode, render: RenderNode, element: string | HTMLElement) {
        if (typeof element === "string") {
            super(parent, render, element);
            this.element = Dom.createElement(element);
            this.appear();
        } else {
            super(parent, render, Dom.tagName(element));
            this.element = element;
            if (this.render) this.appear();
        }
        this.class = HTMLNode;
    }
    moveTo(render: RenderNode) {
        if (!HTMLLabel.has(render.label)) return this.moveTo(div());
        if (this.render === render) return;
        const t = this.parent.delay() + this.parent.duration();
        new Action(t, t, this.render, render, moveTo(this), this, "moveTo");
        this.render = render;
    }
    getAttribute(key: string) {
        if (innerHTMLKey.has(key)) {
            return this.element.innerHTML;
        } else if (key === "value") {
            const interactable = this.element as HTMLInputElement;
            return interactable.value;
        } else if (styleKey.has(key)) {
            return this.element.style[key];
        } else if (callbackKey.has(key)) {
            return this.element[key];
        } else {
            return this.element.getAttribute(key);
        }
    }
    setAttribute(key: string, value: any) {
        if (typeof value.r === "number" && typeof value.g === "number" && typeof value.b === "number") value = `rgb(${value.r}, ${value.g}, ${value.b})`;
        if (innerHTMLKey.has(key)) {
            this.element.innerHTML = value;
        } else if (key === "value") {
            const interactable = this.element as HTMLInputElement;
            interactable.value = value;
        } else if (styleKey.has(key)) {
            this.element.style[key] = value;
        } else if (callbackKey.has(key)) {
            this.element[key] = value;
        } else {
            this.element.setAttribute(key, value);
        }
    }
    removeAttribute(key: string) {
        if (innerHTMLKey.has(key)) {
            this.element.innerHTML = "";
        } else if (key === "value") {
            const interactable = this.element as HTMLInputElement;
            interactable.value = undefined;
        } else if (styleKey.has(key)) {
            this.element.style.removeProperty(key);
        } else if (callbackKey.has(key)) {
            this.element[key] = undefined;
        } else {
            this.element.removeAttribute(key);
        }
    }
}
