import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { RenderNode } from "@/Renderer/RenderNode";

export class HorizontalValueTree extends BaseTree {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取树的层宽
     */
    layerWidth(): number;
    
    /**
     * 设置树的层宽
     * @param width 
     */
    layerWidth(width: number): this;
}