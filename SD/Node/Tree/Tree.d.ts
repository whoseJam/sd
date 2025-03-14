import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { RenderNode } from "@/Renderer/RenderNode";

export class Tree extends BaseTree {
    constructor(parent: SDNode | RenderNode);

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

export function D3Layout(
    mode: "vertical" | "horizontal",
    transX: (node: { x: number, y: number }) => number,
    transY: (node: { x: number, y: number }) => number,
    setSize: (node: SDNode, limit: number) => void
);