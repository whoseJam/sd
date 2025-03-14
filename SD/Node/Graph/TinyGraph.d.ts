import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class TinyGraph extends BaseGraph {
    constructor(parent: SDNode | RenderNode);
}