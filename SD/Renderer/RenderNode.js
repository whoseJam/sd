import { Action } from "@/Animate/Action";
import { div, svg } from "@/Interact/Root";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export const SVGLabel = new Set(["circle", "ellipse", "image", "line", "path", "polygon", "rect", "text", "svg", "g", "marker", "defs"]);
export const HTMLLabel = new Set(["div", "input", "button", "label", "textarea", "canvas"]);

/**
 * Change the structure of the render tree. Append or remove a render node.
 * @param {RenderNode} renderNode
 * @param {SDNode} owner
 */
function treeStructureChange(renderNode, owner) {
    return function (t) {
        if (this.target) {
            // append a render node
            if (t !== 1) return;
            this.target.append(renderNode);
            owner._.created = true;
            requestAnimationFrame(() => {
                owner._.ready = true;
            });
        } else {
            // remove a render node
            if (t !== 0) return;
            renderNode.nake().remove();
            owner._.created = false;
            requestAnimationFrame(() => {
                owner._.ready = false;
            });
        }
    };
}

export function createRenderNode(parent, render, label) {
    const { HTMLNode } = require("@/Renderer/HTML/HTMLNode");
    const { SVGNode } = require("@/Renderer/SVG/SVGNode");
    if (SVGLabel.has(label)) {
        if (SVGLabel.has(render.label)) {
            return new SVGNode(parent, render, label);
        } else {
            return new SVGNode(parent, svg(), label);
        }
    } else if (HTMLLabel.has(label)) {
        if (HTMLLabel.has(render.label)) {
            return new HTMLNode(parent, render, label);
        } else {
            return new HTMLNode(parent, div(), label);
        }
    } else return new SVGNode(parent, render, label);
}

export function RenderNode(parent, render, label) {
    this.parent = parent;
    this.render = render;
    this.label = label;
    this.element = undefined;
}

RenderNode.prototype = {
    nake() {
        return this.element;
    },
    append(label) {
        let child = label;
        if (typeof label === "string") child = new this.class(this.parent, this, label);
        this.nake().append(child.nake());
        return child;
    },
    appendNake(nake) {
        this.nake().append(nake);
    },
    moveTo() {
        ErrorLauncher.notImplementedYet("moveTo");
    },
    appear() {
        if (this.parent === undefined) {
            if (this.render.nake) this.render.nake().appendChild(this.nake());
            else this.render.appendChild(this.nake());
            return;
        }
        if (this.parent.delay) {
            const l = this.parent.delay();
            const r = this.parent.delay() + this.parent.duration();
            new Action(l, r, undefined, this.render, treeStructureChange(this, this.parent), this, "appear");
            new Action(l, r, 0, 1, () => {}, this.parent, "opacity");
        } else {
            const t = 0;
            new Action(t, t, undefined, this.render, treeStructureChange(this, this.parent), this, "appear");
            new Action(t, t, 0, 1, () => {}, this.parent, "opacity");
        }
    },
    remove() {
        const t = this.parent.delay() + this.parent.duration();
        new Action(t, t, this.render, undefined, treeStructureChange(this, this.parent), this, "remove");
    },
    setAttribute() {
        ErrorLauncher.notImplementedYet("setAttribute");
    },
    getAttribute() {
        ErrorLauncher.notImplementedYet("getAttribute");
    },
    hasShape() {
        return true;
    },
};
