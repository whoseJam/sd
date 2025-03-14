import { Action } from "@/Animate/Action";
import { Dom } from "@/Dom/Dom";
import { RenderNode } from "@/Renderer/RenderNode";
import { svg } from "@/Interact/Root";

const SVGLabel = new Set(["circle", "ellipse", "image", "line", "path", "polygon", "rect", "text", "svg", "g", "marker", "defs"]);
const shapeKey = new Set(["circle", "ellipse", "foreignObject", "fragment", "image", "line", "path", "rect", "svg", "text", "polygon", "polyline"]);

function appendAndRemove(svgNode, owner) {
    return function (t) {
        if (this.target) {
            if (t !== 1) return;
            this.target.append(svgNode);
            owner._.created = true;
            requestAnimationFrame(() => {
                owner._.ready = true;
            });
        } else {
            if (t !== 0) return;
            svgNode.element.remove();
            owner._.created = false;
            requestAnimationFrame(() => {
                owner._.ready = false;
            });
        }
    };
}

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
    ...SVGNode.prototype,
    nake() {
        return this.element;
    },
    append(label) {
        if (label.nake) {
            this.nake().append(label.nake());
            return label;
        } else {
            const child = new SVGNode(this.parent, this, label);
            this.nake().append(child.nake());
            return child;
        }
    },
    moveTo(render) {
        if (SVGLabel.has(render.label)) {
            const t = this.parent.delay() + this.parent.duration();
            new Action(t, t, this.render, render, moveTo(this), this, "moveTo");
            this.render = render;
        } else {
            this.moveTo(svg());
        }
    },
    appear() {
        if (this.parent === undefined) {
            this.render.nake().appendChild(this.nake());
            return;
        }
        if (this.parent.delay) {
            const l = this.parent.delay();
            const r = this.parent.delay() + this.parent.duration();
            new Action(l, r, undefined, this.render, appendAndRemove(this, this.parent), this, "appear");
            new Action(l, r, 0, 1, () => {}, this.parent, "opacity");
        } else {
            const t = 0;
            new Action(t, t, undefined, this.render, appendAndRemove(this, this.parent), this, "appear");
            new Action(t, t, 0, 1, () => {}, this.parent, "opacity");
        }
    },
    remove() {
        const t = this.parent.delay() + this.parent.duration();
        new Action(t, t, this.render, undefined, appendAndRemove(this, this.parent), this, "remove");
    },
    getAttribute(key) {
        return this.element.getAttribute(key);
    },
    setAttribute(key, value) {
        if (key === "innerHTML" || key === "text") {
            this.element.innerHTML = value;
        } else if (key === "pointer-events" || key === "min-width" || key === "min-height" || key === "display") {
            this.element.style[key] = value;
        } else if (key === "viewBox" && typeof value === "object") {
            this.element.setAttribute(key, `${value.x} ${value.y} ${value.width} ${value.height}`);
        } else if ((key === "stroke" || key === "fill") && typeof value === "object") {
            this.element.setAttribute(key, `rgb(${value.r}, ${value.g}, ${value.b})`);
        } else {
            this.element.setAttribute(key, value);
        }
    },
    hasShape() {
        return shapeKey.has(this.tag);
    },
};
