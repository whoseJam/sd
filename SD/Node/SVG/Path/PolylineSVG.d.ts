import { BasePathSVG } from "@/Node/SVG/Path/BasePathSVG";
import { RenderNode } from "@/Renderer/RenderNode";

export class PolylineSVG extends BasePathSVG {
    constructor(target: RenderNode, points: Array<[number, number]>);
    points(): Array<[number, number]>;
    points(points: Array<[number, number]>): this;
}
