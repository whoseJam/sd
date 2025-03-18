import { SDNode } from "@/Node/SDNode";

export class RenderNode {
    parent: SDNode;
    render: RenderNode;
    label: string;

    constructor(parent: SDNode, layer: RenderNode, label: string);
    constructor(parent: SDNode, layer: RenderNode, element: HTMLElement | SVGElement);

    nake(): Element;
    append(label: string): RenderNode;
    append(node: RenderNode): RenderNode;
    appendNake(nake: HTMLElement | SVGElement);
    moveTo(layer: RenderNode);
    appear();
    remove();
    setAttribute(key: string, value: any): void;
    getAttribute(key: string): any;
    hasShape(): boolean;
}

export function createRenderNode(parent: SDNode, render: RenderNode, label: string): RenderNode;
export function createRenderNode(parent: SDNode, render: RenderNode, element: HTMLElement | SVGElement): RenderNode;
