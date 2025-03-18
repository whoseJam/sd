import { BaseCurve } from "@/Node/Curve/BaseCurve";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class CircleCurve extends BaseCurve {
    constructor(target: SDNode | RenderNode);
    r(): number;
    r(r: number): this;
}
