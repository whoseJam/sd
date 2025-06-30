import { SD2DNode } from "@/Node/SD2DNode";
import { Rect } from "@/Node/Shape/Rect";
import { RenderNode } from "@/Renderer/RenderNode";

export class FocusPlugin extends Rect {
    focus(): this;
    focus(i: number): this;
    focus(l: number, r: number): this;
    focus(i: number, j: number): this;
    focus(i1: number, j1: number, i2: number, j2: number): this;
    focus(target: SD2DNode): this;
    focus(target1: SD2DNode, target2: SD2DNode): this;
    focus(cancel: null | undefined | false): this;
    rate(): number;
    rate(rate: number): this;
    gap(): number;
    gap(gap: number): this;
}

export function Focus(target: SD2DNode | RenderNode): FocusPlugin;
