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

    element(id: number): SDNode | undefined;
    elements(): Array<SDNode>;
    lastElement(): SDNode | undefined;
    firstElement(): SDNode | undefined;
    forEachElement(callback: (element: SDNode, id: number) => void): this;

    opacity(id: number): number;
    opacity(id: number, opacity: number): this;
    color(color: SDColor): this;
    color(id: number): PacketColor;
    color(id: number, color: SDColor): this;
    color(l: number, r: number, color: SDColor): this;
    text(id: number): string;
    text(id: number, text: string): this;
    intValue(id: number): number;
    value(id: number): SDNode;
    value(id: number, value: SDNode): this;

    insert(id: number, value: any): this;
    insertFromExistValue(id: number, value: SDNode): this;
    insertFromExistElement(id: number, element: SDNode): this;
    push(value: any): this;
    pushFromExistValue(value: SDNode): this;
    pushFromExistElement(element: SDNode): this;
    pushArray(array: Array<any>): this;

    erase(id: number): this;
    pop(): this;
    dropElement(id: number): SDNode | undefined;
    dropFirstElement(): SDNode | undefined;
    dropLastElement(): SDNode | undefined;
    dropValue(id: number): SDNode | undefined;
    dropFirstValue(): SDNode | undefined;
    dropLastValue(): SDNode | undefined;

    sort(comparator?: (a: SDNode, b: SDNode) => number): this;
    sort(l: number, r: number, comparator?: (a: SDNode, b: SDNode) => number): this;
}
