import { BaseGrid } from "@/Node/Grid/BaseGrid";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class ValueGrid extends Grid {
    constructor(target: SDNode | RenderNode);
    insert(i: number, j: number, value: SDNode): this;
}
