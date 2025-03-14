import { BaseNake } from "@/Node/Nake/BaseNake";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Ellipse extends BaseNake {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取 x 方向的半径
     */
    rx(): number;

    /**
     * 设置 x 方向的半径
     * @param rx
     */
    rx(rx: number): this;

    /**
     * 获取 y 方向的半径
     */
    ry(): number;

    /**
     * 设置 y 方向的半径
     * @param ry
     */
    ry(ry: number): this;
}
