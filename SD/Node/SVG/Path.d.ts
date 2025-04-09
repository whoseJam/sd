import { SDNode } from "@/Node/SDNode";
import { BaseSVGLine } from "@/Node/SVG/BaseSVGLine";
import { RenderNode } from "@/Renderer/RenderNode";

export class Path extends BaseSVGLine {
    constructor(target: SDNode | RenderNode);

    /**
     * 获取轨迹
     */
    d(): string;

    /**
     * 设置轨迹
     * @param d
     */
    d(d: string): this;
}
