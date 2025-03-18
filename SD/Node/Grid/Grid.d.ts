import { BaseGrid } from "@/Node/Grid/BaseGrid";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

type Axis = "row" | "col";
type Align = "x" | "y" | "cx" | "cy" | "mx" | "my";

export class Grid extends BaseGrid {
    constructor(target: SDNode | RenderNode);
    axis(): Axis;
    axis(axis: Axis): this;
    align(): Align;
    align(align: Align): this;
    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
    width(): number;
    width(width: number): this;
    height(): number;
    height(height: number): this;
    insert(i: number, j: number, value: SDNode): this;
    erase(i: number, j: number): this;
}
