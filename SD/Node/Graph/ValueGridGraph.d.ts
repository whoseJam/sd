import { GridGraph } from "@/Node/Graph/GridGraph";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class ValueGridGraph extends GridGraph {
    constructor(target: SDNode | RenderNode);
}
