import { SDNode } from "@/Node/SDNode";
import { Rect } from "@/Node/SVG/Rect";

export class CompFocus {
    focus(): this;
    focus(i: number): this;
    focus(l: number, r: number): this;
    focus(i: number, j: number): this;
    focus(i1: number, j1: number, i2: number, j2: number): this;
    focus(element: SDNode): this;
    focus(element1: SDNode, element2: SDNode): this;
    focus(element: null | undefined | false): this;
    gap(): number;
    gap(gap: number): this;
    rate(): number;
    rate(rate: number): this;
}

export function Focus(parent: SDNode): CompFocus & Rect;
