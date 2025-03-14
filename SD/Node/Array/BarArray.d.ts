import { BaseArray } from "@/Node/Array/BaseArray";
import { RenderNode } from "@/Renderer/RenderNode";

export class BarArray extends BaseArray {
    constructor(parent: SDNod | RenderNode);
    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
}
