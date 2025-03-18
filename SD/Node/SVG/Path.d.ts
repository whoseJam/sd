import { SDNode } from "@/Node/SDNode";
import { BaseLine } from "@/Node/SVG/BaseLine";
import { RenderNode } from "@/Renderer/RenderNode";

export class Path extends BaseLine {
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
