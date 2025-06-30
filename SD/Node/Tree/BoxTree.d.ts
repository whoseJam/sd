import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { RenderNode } from "@/Renderer/RenderNode";

export class BoxTree extends BaseTree {
    constructor(target: SDNode | RenderNode);

    elementWidth(): number;

    elementWidth(width: number): this;

    elementHeight(): number;

    elementHeight(height: number): this;

    layerHeight(): number;

    layerHeight(height: number): this;
}
