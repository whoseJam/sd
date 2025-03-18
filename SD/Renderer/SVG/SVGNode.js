import { Action } from "@/Animate/Action";
import { Dom } from "@/Dom/Dom";
import { svg } from "@/Interact/Root";
import { RenderNode, SVGLabel } from "@/Renderer/RenderNode";

const innerHTMLKey = new Set(["innerHTML", "text"]);
const styleKey = new Set(["pointer-events", "min-width", "min-height", "display"]);
const shapeKey = new Set(["circle", "ellipse", "foreignObject", "fragment", "image", "line", "path", "rect", "svg", "text", "polygon", "polyline"]);

function moveTo(element) {
    return function (t) {
        if (t !== 1) return;
        this.target.append(element);
    };
}

export function SVGNode(parent, render, label) {
    RenderNode.call(this, parent, render, label);
    if (typeof label === "string") {
        if (label === "view") {
            this.element = Dom.createSVGElement("svg");
        } else {
            this.element = Dom.createSVGElement(label);
        }
        this.appear();
    } else {
        this.element = label;
        this.label = Dom.tagName(label);
        if (this.render) this.appear();
    }
}

SVGNode.prototype = {
    ...RenderNode.prototype,
    class: SVGNode,
    moveTo(render) {
        if (SVGLabel.has(render.label)) {
            const t = this.parent.delay() + this.parent.duration();
            new Action(t, t, this.render, render, moveTo(this), this, "moveTo");
            this.render = render;
        } else {
            this.moveTo(svg());
        }
    },
    getAttribute(key) {
        if (innerHTMLKey.has(key)) {
            return this.element.innerHTML;
        } else if (styleKey.has(key)) {
            return this.element.style[key];
        }
        return this.element.getAttribute(key);
    },
    setAttribute(key, value) {
        if (typeof value.r === "number" && typeof value.g === "number" && typeof value.b === "number") value = `rgb(${value.r}, ${value.g}, ${value.b})`;
        if (innerHTMLKey.has(key)) {
            this.element.innerHTML = value;
        } else if (styleKey.has(key)) {
            this.element.style[key] = value;
        } else if (key === "viewBox" && typeof value === "object") {
            this.element.setAttribute(key, `${value.x} ${value.y} ${value.width} ${value.height}`);
        } else {
            this.element.setAttribute(key, value);
        }
    },
    hasShape() {
        return shapeKey.has(this.tag);
    },
};
