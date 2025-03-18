import { SDNode } from "@/Node/SDNode";
import { BaseSVG } from "@/Node/SVG/BaseSVG";
import { RenderNode } from "@/Renderer/RenderNode";

/**
 * 圆形组件
 */
export class Circle extends BaseSVG {
    constructor(target: SDNode | RenderNode);

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
