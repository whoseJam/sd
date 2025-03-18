import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { RenderNode } from "@/Renderer/RenderNode";

export class ValueTree extends BaseTree {
    constructor(target: SDNode | RenderNode);
}
