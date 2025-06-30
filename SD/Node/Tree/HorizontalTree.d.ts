import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { RenderNode } from "@/Renderer/RenderNode";

export class HorizontalTree extends BaseTree {
    constructor(target: SDNode | RenderNode);

    layerWidth(): number;

    layerWidth(width: number): this;
}
