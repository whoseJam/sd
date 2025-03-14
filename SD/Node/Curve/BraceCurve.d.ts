import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class BraceCurve extends BaseCurve {
    constructor(parent: SDNode | RenderNode);
    bending(): number;
    bending(bending: number): this;
}