import { BaseShape } from "@/Node/Shape/BaseShape";
import { RenderNode } from "@/Renderer/RenderNode";

export class Polygon extends BaseShape {
    constructor(target: RenderNode, points: Array<[number, number]>);
    points(): Array<[number, number]>;
    points(points: Array<[number, number]>): this;
}
