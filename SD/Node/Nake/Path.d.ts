import { BaseLine } from "@/Node/Nake/BaseLine";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Path extends BaseLine {
    constructor(parent: SDNode | RenderNode);

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
