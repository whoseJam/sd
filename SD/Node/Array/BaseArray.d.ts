import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { PacketColor, SDColor } from "@/Utility/Color";

export class BaseArray extends SD2DNode {
    start(): number;
    start(start: number): this;
    end(): number;
    length(): number;
    length(length: number): this;
    resize(length: number): this;
    idx(id: number): number;
    indexOf(element: SDNode): number;

    element(id: number): SDNode;
    elements(): Array<SDNode>;
    lastElement(): SDNode;
    firstElement(): SDNode;
    forEachElement(callback: (element: SDNode, id: number) => void): this;
    opacity(id: number): number;
    opacity(id: number, opacity: number): this;
    color(color: SDColor): this;
    color(id: number): PacketColor;
    color(id: number, color: SDColor): this;
    color(l: number, r: number, color: SDColor): this;

    value(id: number): SDNode;
    value(id: number, value: SDNode): this;
    text(id: number): string;
    text(id: number, text: string): this;
    intValue(id: number): number;

    insert(id: number, value: any): this;
    insertFromExistElement(id: number, element: SDNode): this;
    push(value: any): this;
    pushArray(array: Array<any>): this;
    pushFromExistValue(value: SDNode): this;
    pushFromExistElement(element: SDNode): this;

    pop(): this;
    erase(id: number): this;
    dropElement(id: number): SDNode;
    dropFirstElement(): SDNode;
    dropLastElement(): SDNode;
    dropValue(id: number): SDNode;

    sort(comparator?: (a: SDNode, b: SDNode) => number): this;
    sort(l: number, r: number, comparator?: (a: SDNode, b: SDNode) => number): this;
}
