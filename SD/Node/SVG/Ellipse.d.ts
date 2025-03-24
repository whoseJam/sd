import { SDNode } from "@/Node/SDNode";
import { BaseSVG } from "@/Node/SVG/BaseSVG";
import { RenderNode } from "@/Renderer/RenderNode";

export class Ellipse extends BaseSVG {
    constructor(target: SDNode | RenderNode);

    rx(): number;
    rx(rx: number): this;
    ry(): number;
    ry(ry: number): this;
}
