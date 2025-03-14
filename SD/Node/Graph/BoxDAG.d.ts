import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { DAG } from "@/Node/Graph/DAG";

export class BoxDAG extends DAG {
    constructor(parent: SDNode | RenderNode);
    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
}