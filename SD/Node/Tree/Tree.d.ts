import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";

export class Tree extends BaseTree {
    layout(): "vertical" | "horizontal";
    layout(mode: "vertical" | "horizontal"): this;
    layerGap(): number;
    layerGap(gap: number): this;
    layerWidth(): number;
    layerWidth(width: number): this;
    layerHeight(): number;
    layerHeight(height: number): this;
}

export function D3Layout(mode: "vertical" | "horizontal", transX: (node: { x: number; y: number }) => number, transY: (node: { x: number; y: number }) => number, setSize: (node: SDNode, limit: number) => void);
