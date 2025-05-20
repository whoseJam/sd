import { BasePath } from "@/Node/Path/BasePath";
import { RenderNode } from "@/Renderer/RenderNode";

export class Polyline extends BasePath {
    constructor(target: RenderNode, points: Array<[number, number]>);
    points(): Array<[number, number]>;
    points(points: Array<[number, number]>): this;
}
