import { SDNode } from "@/Node/SDNode";
import { BaseSVG } from "@/Node/SVG/BaseSVG";
import { RenderNode } from "@/Renderer/RenderNode";

export class Polygon extends BaseSVG {
    constructor(target: SDNode | RenderNode);

    /**
     * 获取多边形上的点
     */
    points(): [[number, number]];

    /**
     * 设置多边形上的点
     * @param points
     */
    points(points: [[number, number]]): this;
}
