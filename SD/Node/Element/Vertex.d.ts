import { BaseElement } from "@/Node/Element/BaseElement";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Vertex extends BaseElement {
    constructor(target: SDNode | RenderNode);
    r(): number;
    r(r: number): this;
}
