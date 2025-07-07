import { Polygon } from "@/Node/Shape/Polygon";
import { RenderNode } from "@/Renderer/RenderNode";

export class PolygonSVG extends Polygon {
    constructor(target: RenderNode, points: Array<[number, number]>);
    points(): [[number, number]];
    points(points: [[number, number]]): this;
}
