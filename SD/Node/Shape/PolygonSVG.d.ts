import { BaseSVG } from "@/Node/SVG/BaseSVG";
import { RenderNode } from "@/Renderer/RenderNode";

export class PolygonSVG extends BaseSVG {
    constructor(target: RenderNode, points: Array<[number, number]>);
    points(): [[number, number]];
    points(points: [[number, number]]): this;
}
