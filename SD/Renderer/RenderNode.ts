import { Action } from "@/Animate/Action";
import { div, svg } from "@/Interact/Root";
import { SDNode } from "@/Node/SDNode";
import { HTMLNode } from "@/Renderer/HTML/HTMLNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";

export const SVGLabel = new Set(["circle", "ellipse", "image", "line", "path", "polygon", "rect", "text", "svg", "g", "marker", "defs"]);
export const HTMLLabel = new Set(["div", "input", "button", "textarea", "img"]);

export function createRenderNode(parent: SDNode, render: RenderNode, element: string | Element) {
    const { HTMLNode } = require("@/Renderer/HTML/HTMLNode");
    const { SVGNode } = require("@/Renderer/SVG/SVGNode");
    if (typeof element !== "string") return new SVGNode(parent, render, element);
    if (SVGLabel.has(element)) {
        if (SVGLabel.has(render.label)) {
            return new SVGNode(parent, render, element);
        } else {
            return new SVGNode(parent, svg(), element);
        }
    } else if (HTMLLabel.has(element)) {
        if (HTMLLabel.has(render.label)) {
            return new HTMLNode(parent, render, element);
        } else {
            return new HTMLNode(parent, div(), element);
        }
    } else return new SVGNode(parent, render, element);
}

export function createHtmlNodeOnForeignObject(parent: SDNode, render: RenderNode, label: string) {
    return new HTMLNode(parent, render, label);
}

export class RenderNode {
    parent: SDNode;
    render: RenderNode;
    label: string;
    element: Element;
    class: typeof HTMLNode | typeof SVGNode;
    constructor(container: Element);
    constructor(parent: SDNode | undefined, render: RenderNode | undefined, label: string);
    constructor(arg0: Element | SDNode | undefined, arg1?: RenderNode | undefined, arg2?: string) {
        if (arg0 instanceof Element) {
            this.element = arg0;
        } else {
            this.parent = arg0;
            this.render = arg1;
            this.label = arg2;
            this.element = undefined;
        }
    }
    nake() {
        return this.element;
    }
    __append(element: RenderNode | Element) {
        if (element instanceof RenderNode) this.nake().append(element.nake());
        else this.nake().append(element);
    }
    __remove() {
        this.nake().remove();
    }
    append(element: string | RenderNode) {
        if (typeof element === "string") {
            const child = new this.class(this.parent, this, element);
            this.__append(child);
            return child;
        }
        element.moveTo(this);
        return element;
    }
    moveTo(render: RenderNode) {
        ErrorLauncher.notImplementedYet("moveTo");
    }
    appear() {
        if (this.parent === undefined) {
            this.render.__append(this);
            return;
        }
        const render = this;
        const node = this.parent;
        const LLLLLL = this.parent.delay() + this.parent.duration();
        function structure(t: number) {
            if (this.target && t === 1) {
                this.target.__append(render);
                node._.created = true;
                requestAnimationFrame(() => {
                    node._.ready = true;
                });
            }
            if (!this.target && t === 0) {
                render.__remove();
                node._.created = false;
                requestAnimationFrame(() => {
                    node._.ready = false;
                });
            }
        }
        const l = this.parent.delay();
        const r = this.parent.delay() + this.parent.duration();
        new Action(l, r, undefined, this.render, structure, this, "appear");
        new Action(l, r, 0, 1, undefined, this.parent, "opacity");
    }
    remove() {
        const render = this;
        const node = this.parent;
        function structure(t: number) {
            if (this.target && t === 0) {
                this.target.__append(render);
                node._.created = true;
                requestAnimationFrame(() => {
                    node._.ready = true;
                });
            }
            if (!this.target && t === 1) {
                render.__remove();
                node._.created = false;
                requestAnimationFrame(() => {
                    node._.ready = false;
                });
            }
        }
        const l = this.parent.delay();
        const r = this.parent.delay() + this.parent.duration();
        new Action(l, r, this.render, undefined, structure, this, "remove");
    }
    getAttribute(key: string): any {
        ErrorLauncher.notImplementedYet("getAttribute");
    }
    setAttribute(key: string, value: any) {
        ErrorLauncher.notImplementedYet("setAttribute");
    }
    hasShape() {
        return true;
    }
}
