import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

type ViewBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export class View extends SD2DNode {
    constructor(target: SDNode | RenderNode);

    /**
     * 添加元素
     * @param element
     */
    push(element: SDNode): this;

    /**
     * 获取 viewBox
     */
    viewBox(): ViewBox;

    /**
     * 设置 viewBox
     * @param viewBox
     */
    viewBox(viewBox: ViewBox): this;

    /**
     * 设置 viewBox
     * @param x
     * @param y
     * @param width
     * @param height
     */
    viewBox(x: number, y: number, width: number, height: number): this;
}
