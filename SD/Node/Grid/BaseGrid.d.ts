import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { SDColor } from "@/Utility/Color";

export class BaseGrid extends SD2DNode {
    startN(): number;
    startN(start: number): this;
    startM(): number;
    startM(start: number): this;
    endN(): number;
    endM(): number;
    endM(i: number): number;
    idxN(i: number): number;
    idxM(j: number): number;
    n(): number;
    n(n: number): this;
    m(): number;
    m(m: number): this;

    element(i: number, j: number): SDNode;
    forEachElement(callback: (element: SDNode, rowId: number, colId: number) => void): this;

    opacity(i: number, j: number): number;
    opacity(i: number, j: number, opacity: number): this;
    color(color: SDColor): this;
    color(i: number, j: number): SDColor;
    color(i: number, j: number, color: SDColor): this;
    text(i: number, j: number): string;
    text(i: number, j: number, text: string): this;
    intValue(i: number, j: number): number;
    value(i: number, j: number): SDNode;
    value(i: number, j: number, value: any): this;

    insert(i: number, j: number, value?: any): this;
    insertFromExistValue(i: number, j: number, value: SDNode): this;
    insertFromExistElement(i: number, j: number, element: SDNode): this;
    pushCol(): this;
    pushCol(count: number): this;
    pushRow(): this;
    pushRow(count: number): this;

    erase(i: number, j: number): this;
    dropElement(i: number, j: number): SDNode | undefined;
    dropValue(i: number, j: number): SDNode | undefined;
    popCol(): this;
    popRow(): this;
}
