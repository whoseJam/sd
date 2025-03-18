import { BaseGraph } from "@/Node/Graph/BaseGraph";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class GridGraph extends BaseGraph {
    constructor(target: SDNode | RenderNode);
    n(): number;
    n(n: number): this;
    m(): number;
    m(m: number): this;
    at(i: number, j: number): this;
}
