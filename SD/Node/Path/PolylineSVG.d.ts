import { Polyline } from "@/Node/Path/Polyline";
import { RenderNode } from "@/Renderer/RenderNode";

export class PolylineSVG extends Polyline {
    constructor(target: RenderNode, points: Array<[number, number]>);
    points(): Array<[number, number]>;
    points(points: Array<[number, number]>): this;
}
