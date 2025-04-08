import { BaseGrid } from "@/Node/Grid/BaseGrid";

type Axis = "row" | "col";
type Align = "x" | "y" | "cx" | "cy" | "mx" | "my";

export class Grid extends BaseGrid {
    axis(): Axis;
    axis(axis: Axis): this;
    align(): Align;
    align(align: Align): this;
    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
}
