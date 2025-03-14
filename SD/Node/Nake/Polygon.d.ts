import { BaseNake } from "@/Node/Nake/BaseNake";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Polygon extends BaseNake {
    constructor(parent: SDNode | RenderNode);

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
