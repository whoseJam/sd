import { SD2DNode } from "@/Node/SD2DNode";
import { SDColor } from "@/Utility/Color";

export class BaseGrid extends SD2DNode {
    startN(): number;
    startN(start: number): this;
    startM(): number;
    startM(start: number): this;
    endN(): number;
    endM(): number;
    endM(i: number): number;
    n(): number;
    n(n: number): this;
    m(): number;
    m(m: number): this;

    element(i: number, j: number): SD2DNode | undefined;
    forEachElement(callback: (element: SD2DNode, i: number, j: number) => void): this;

    opacity(i: number, j: number): number;
    opacity(i: number, j: number, opacity: number): this;
    color(color: string | SDColor): this;
    color(i: number, j: number): SDColor;
    color(i: number, j: number, color: string | SDColor): this;
    text(i: number, j: number): string;
    text(i: number, j: number, text: number | string): this;
    intValue(i: number, j: number): number;
    value(i: number, j: number): SD2DNode;
    value(i: number, j: number, value: any): this;

    insert(i: number, j: number, value?: any): this;
    insertFromExistValue(i: number, j: number, value: SD2DNode): this;
    insertFromExistElement(i: number, j: number, element: SD2DNode): this;
    pushSecondary(): this;
    pushSecondary(count: number): this;
    pushPrimary(): this;
    pushPrimary(count: number): this;

    erase(i: number, j: number): this;
    dropElement(i: number, j: number): SD2DNode | undefined;
    dropValue(i: number, j: number): SD2DNode | undefined;
    popSecondary(): this;
    popPrimary(): this;
}
