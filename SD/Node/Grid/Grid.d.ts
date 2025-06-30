import { BaseGrid } from "@/Node/Grid/BaseGrid";

export class Grid extends BaseGrid {
    axis(): "row" | "col";
    axis(axis: "row" | "col"): this;

    align(): "x" | "y" | "cx" | "cy" | "mx" | "my";
    align(align: "x" | "y" | "cx" | "cy" | "mx" | "my"): this;
    elementWidth(): number;
    elementWidth(width: number): this;
    elementHeight(): number;
    elementHeight(height: number): this;
}
