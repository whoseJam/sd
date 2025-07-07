import { SDNode } from "@/Node/SDNode";
import { SDColor } from "@/Utility/Color";

export class BaseArray extends SDNode {
    start(): number;
    start(start: number): this;
    end(): number;

    length(): number;
    length(length: number): this;
    resize(length: number): this;
    indexOf(element: SDNode): number;
    element(i: number): any;
    elements(): Array<any>;
    lastElement(): any;
    firstElement(): any;
    forEachElement(callback: (element: any, id: number) => void): this;

    opacity(i: number): number;
    opacity(i: number, opacity: number): this;
    color(color: string | SDColor): this;
    color(i: number): SDColor;
    color(i: number, color: string | SDColor): this;
    color(l: number, r: number, color: string | SDColor): this;
    text(i: number): string;
    text(i: number, text: number | string): this;
    intValue(i: number): number;
    value(i: number): any;
    value(i: number, value: any): this;

    insert(i: number, value: any): this;
    insertFromExistValue(i: number, value: SDNode): this;
    insertFromExistElement(i: number, element: SDNode): this;
    push(value: any): this;
    pushFromExistValue(value: SDNode): this;
    pushFromExistElement(element: SDNode): this;
    pushArray(array: Array<any>): this;

    erase(i: number): this;
    pop(): this;
    dropElement(i: number): any;
    dropFirstElement(): any;
    dropLastElement(): any;
    dropValue(i: number): any;
    dropFirstValue(): any;
    dropLastValue(): any;

    sort(comparator?: (a: any, b: any) => number): this;
    sort(l: number, r: number, comparator?: (a: any, b: any) => number): this;
}
