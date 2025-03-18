import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class HTMLNode extends RenderNode {
    constructor(parent: SDNode, layer: RenderNode, label: string);
    constructor(parent: SDNode, layer: RenderNode, label: HTMLElement);
}
