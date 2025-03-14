import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class BipartiteGraph extends BaseGraph {
    constructor(parent: SDNode | RenderNode);
    newNode(id: number | string, no: 0 | 1): this;
    newNode(id: number | string, value: any, no: 0 | 1): this;
}
