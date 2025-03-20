import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDColor } from "@/Utility/Color";

export class BaseGrid extends SD2DNode {
    constructor(target: SDNode | RenderNode);
    startN(): number;
    startN(start: number): this;
    startM(): number;
    startM(start: number): this;
    endN(): number;
    endM(): number;
    endM(index: number): number;
    idxN(index: number): number;
    idxM(index: number): number;
    n(n: number): this;
    m(m: number): this;
    pushCol(): this;
    pushCol(count: number): this;
    pushRow(): this;
    pushRow(count: number): this;
    element(i: number, j: number): SDNode;
    forEachElement(callback: (element: SDNode, rowId: number, colId: number) => void): this;
    value(i: number, j: number): SDNode;
    value(i: number, j: number, value: SDNode): this;
    text(i: number, j: number): string;
    intValue(i: number, j: number): number;
    opacity(i: number, j: number): number;
    opacity(i: number, j: number, opacity: number): this;
    color(color: SDColor): this;
    color(i: number, j: number): SDColor;
    color(i: number, j: number, color: SDColor): this;
}
