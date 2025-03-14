import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class SVGNode extends RenderNode {
    constructor(parent: SDNode, layer: RenderNode, label: string);
    constructor(parent: SDNode, layer: RenderNode, label: SVGElement);

    nake(): SVGElement;
    append(tag: string): SVGNode;
    moveTo(layer: RenderNode): void;
    appear(): void;
    remove(): void;
    setAttribute(key: string, value: any): void;
    getAttribute(key: string): any;
}