import { Action } from "@/Animate/Action";
import { Dom } from "@/Dom/Dom";
import { div } from "@/Interact/Root";
import { HTMLLabel, RenderNode } from "@/Renderer/RenderNode";

const innerHTMLKey = new Set(["innerHTML", "text"]);
const callbackKey = new Set(["onclick", "onchange"]);
const styleKey = new Set(["position", "left", "top", "pointer-events", "width", "height", "border", "overflow", "transform", "opacity", "display", "min-width", "min-height", "white-space", "background-color", "color", "border-color", "border-style", "border-width", "border-radius", "aspect-ratio", "object-fit"]);

export function HTMLNode(parent, render, label) {
    RenderNode.call(this, parent, render, label);
    if (typeof label === "string") {
        this.element = Dom.createElement(label);
        this.appear();
    } else {
        this.element = label;
        this.label = Dom.tagName(label);
        if (this.render) this.appear();
    }
}

function moveTo(element) {
    return function (t) {
        if (t !== 1) return;
        this.target.appear(element);
    };
}

HTMLNode.prototype = {
    ...RenderNode.prototype,
    class: HTMLNode,
    moveTo(render) {
        if (HTMLLabel.has(render.label)) {
            if (this.render !== render) {
                const t = this.parent.delay() + this.parent.duration();
                new Action(t, t, this.render, render, moveTo(this), this, "moveTo");
                this.render = render;
            }
        } else {
            this.moveTo(div());
        }
    },
    getAttribute(key) {
        if (innerHTMLKey.has(key)) {
            return this.element.innerHTML;
        } else if (key === "value") {
            return this.element.value;
        } else if (styleKey.has(key)) {
            return this.element.style[key];
        } else if (callbackKey.has(key)) {
            return this.element[key];
        } else {
            return this.element.getAttribute(key);
        }
    },
    setAttribute(key, value) {
        if (typeof value.r === "number" && typeof value.g === "number" && typeof value.b === "number") value = `rgb(${value.r}, ${value.g}, ${value.b})`;
        if (innerHTMLKey.has(key)) {
            this.element.innerHTML = value;
        } else if (key === "value") {
            this.element.value = value;
        } else if (styleKey.has(key)) {
            this.element.style[key] = value;
        } else if (callbackKey.has(key)) {
            this.element[key] = value;
        } else {
            this.element.setAttribute(key, value);
        }
    },
    removeAttribute(key) {
        if (innerHTMLKey.has(key)) {
            this.element.innerHTML = "";
        } else if (key === "value") {
            this.element.value = undefined;
        } else if (styleKey.has(key)) {
            this.element.style.removeProperty(key);
        } else if (callbackKey.has(key)) {
            this.element[key] = undefined;
        } else {
            this.element.removeAttribute(key);
        }
    },
};
