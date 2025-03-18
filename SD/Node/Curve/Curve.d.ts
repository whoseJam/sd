import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Curve extends BaseCurve {
    constructor(target: SDNode | RenderNode);
    bending(): number;
    bending(bending: number): this;
}
