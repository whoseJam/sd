import { SD2DNode } from "@/Node/SD2DNode";
import { SDColor } from "@/Utility/Color";

export class BaseArray extends SD2DNode {
    start(): number;
    start(start: number): this;
    end(): number;

    length(): number;
    length(length: number): this;
    resize(length: number): this;
    indexOf(element: SD2DNode): number;
    element(i: number): SD2DNode | undefined;
    elements(): Array<SD2DNode>;
    lastElement(): SD2DNode | undefined;
    firstElement(): SD2DNode | undefined;
    forEachElement(callback: (element: SD2DNode, id: number) => void): this;

    opacity(i: number): number;
    opacity(i: number, opacity: number): this;
    color(color: SDColor | string): this;
    color(i: number): SDColor;
    color(i: number, color: SDColor | string): this;
    color(l: number, r: number, color: SDColor | string): this;
    text(i: number): string;
    text(i: number, text: number | string): this;
    intValue(i: number): number;
    value(i: number): SD2DNode | undefined;
    value(i: number, value: any): this;

    insert(i: number, value: any): this;
    insertFromExistValue(i: number, value: SD2DNode): this;
    insertFromExistElement(i: number, element: SD2DNode): this;
    push(value: any): this;
    pushFromExistValue(value: SD2DNode): this;
    pushFromExistElement(element: SD2DNode): this;
    pushArray(array: Array<any>): this;

    erase(i: number): this;
    pop(): this;
    dropElement(i: number): SD2DNode | undefined;
    dropFirstElement(): SD2DNode | undefined;
    dropLastElement(): SD2DNode | undefined;
    dropValue(i: number): SD2DNode | undefined;
    dropFirstValue(): SD2DNode | undefined;
    dropLastValue(): SD2DNode | undefined;

    sort(comparator?: (a: SD2DNode, b: SD2DNode) => number): this;
    sort(l: number, r: number, comparator?: (a: SD2DNode, b: SD2DNode) => number): this;
}
