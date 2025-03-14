import { BaseNake } from "@/Node/Nake/BaseNake";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * 圆形组件
 */
export class Circle extends BaseNake {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取半径
     */
    r(): number;

    /**
     * 设置半径
     * @param r
     */
    r(r: number): this;
}
