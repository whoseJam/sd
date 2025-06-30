import { Dom } from "@/Dom/Dom";
import { SDNode } from "@/Node/SDNode";
import { TextEngine } from "@/Node/Text/TextEngine";
import { RenderNode } from "@/Renderer/RenderNode";
import { SVGNode } from "@/Renderer/SVG/SVGNode";

export function createMathjaxRenderNode(parent: SDNode, render: RenderNode, element: number | string | SVGElement) {
    if (typeof element === "number" || typeof element === "string") element = MathJax.tex2svg(element).children[0];
    const svg = element as SVGSVGElement;
    for (const key of ["fill", "stroke"]) {
        svg.setAttribute(key, svg.children[1].getAttribute(key));
        svg.children[1].removeAttribute(key);
    }
    for (const key of ["fill", "stroke", "x", "y", ["font-size", "fontSize"]]) {
        if (typeof key === "string") svg.setAttribute(key, parent.vars[key]);
        else svg.setAttribute(key[0], parent.vars[key[1]]);
    }
    return new MathjaxNode(parent, render, svg);
}

export class MathjaxNode extends SVGNode {
    constructor(other: MathjaxNode);
    constructor(parent: SDNode, render: RenderNode, element: SVGElement);
    constructor(arg0: MathjaxNode | SDNode, arg1?: RenderNode, arg2?: SVGElement) {
        if (arg0 instanceof SDNode) {
            super(arg0, arg1, arg2);
            TextEngine.adjustMathjax(this);
        } else {
            const element = Dom.deepClone(arg0.element);
            super(arg0.parent, arg0.render, element);
        }
    }
    clone(): MathjaxNode {
        return new MathjaxNode(this);
    }
}
