import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * 箱子树组件
 */
export class BoxTree extends BaseTree {
    constructor(target: SDNode | RenderNode);

    /**
     * 获取箱子的宽度
     */
    elementWidth(): number;

    /**
     * 设置箱子的宽度
     * @param width
     */
    elementWidth(width: number): this;

    /**
     * 获取箱子的高度
     */
    elementHeight(): number;

    /**
     * 设置箱子的高度
     * @param height
     */
    elementHeight(height: number): this;

    /**
     * 获取树的层高
     */
    layerHeight(): number;

    /**
     * 设置树的层高
     * @param height
     */
    layerHeight(height: number): this;
}
