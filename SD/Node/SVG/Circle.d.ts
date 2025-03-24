import { SDNode } from "@/Node/SDNode";
import { BaseSVG } from "@/Node/SVG/BaseSVG";
import { RenderNode } from "@/Renderer/RenderNode";

export class Circle extends BaseSVG {
    constructor(target: SDNode | RenderNode);

    r(): number;
    r(r: number): this;
}
