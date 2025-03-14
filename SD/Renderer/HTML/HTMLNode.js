import { Dom } from "@/Dom/Dom";
import { div } from "@/Interact/Root";
import { RenderNode } from "@/Renderer/RenderNode";

const innerHTMLKey = new Set(["innerHTML", "text"]);
const callbackKey = new Set(["onclick", "onchange"]);
const styleKey = new Set(["position", "left", "top", "pointer-events", "width", "height", "border", "overflow", "transform", "opacity", "display", "min-width", "min-height", "white-space", "background-color", "color", "border-color"]);
const HTMLLabel = new Set(["div", "input", "button", "label", "textarea", "canvas"]);

export function HTMLNode(parent, render, label) {
    RenderNode.call(this, parent, render, label);
    if (typeof label === "string") {
        this.element = Dom.createElement(label);
    } else {
        this.element = label;
        this.label = Dom.tagName(label);
    }
    if (!render) document.body.append(this.element);
    else if (render.nake) render.append(this);
    else render.append(this.element);
}

HTMLNode.prototype = {
    ...HTMLNode.prototype,
    nake: function () {
        return this.element;
    },
    append(label) {
        if (label.nake) {
            this.nake().append(label.nake());
            return label;
        } else {
            const child = new HTMLNode(this.parent, this, label);
            this.nake().append(child.nake());
            return child;
        }
    },
    moveTo(render) {
        if (HTMLLabel.has(render.label)) {
            render.append(this.nake());
            this.render = render;
        } else {
            this.moveTo(div());
        }
    },
    appear() {
        throw new Error("Not Implemented Yet");
    },
    remove() {
        this.element.remove();
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
        if (innerHTMLKey.has(key)) {
            this.element.innerHTML = value;
        } else if (key === "value") {
            this.element.value = value;
        } else if (styleKey.has(key)) {
            if (value.r && value.g && value.b) value = `rgb(${value.r}, ${value.g}, ${value.b})`;
            this.element.style[key] = value;
        } else if (callbackKey.has(key)) {
            this.element[key] = value;
        } else {
            this.element.setAttribute(key, value);
        }
    },
    hasShape() {
        return true;
    },
};
