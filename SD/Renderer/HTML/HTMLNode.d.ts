import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class HTMLNode extends RenderNode {
    constructor(parent: SDNode, layer: RenderNode, tag: string);
    constructor(parent: SDNode, layer: RenderNode, tag: HTMLElement);

    nake(): HTMLElement;
    append(tag: string): HTMLNode;
    moveTo(layer: RenderNode): void;
    appear(): void;
    remove(): void;
    setAttribute(key: string, value: any): void;
    getAttribute(key: string): any;
}