import { SDNode } from "@/Node/SDNode";

export function createRenderNode(parent: SDNode, render: RenderNode, label: string): RenderNode;

export class RenderNode {
    parent: SDNode;
    render: RenderNode;
    label: string;

    constructor(parent: SDNode, layer: RenderNode, tag: string);

    nake(): Element;
    append(tag: string): RenderNode;
    moveTo(layer: RenderNode);
    appear();
    remove();
    setAttribute(key: string, value: any);
}
