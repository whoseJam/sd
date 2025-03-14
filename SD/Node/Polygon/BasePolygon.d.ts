import { Polygon } from "@/Node/Nake/Polygon";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class BasePolygon extends Polygon {
    constructor(parent: SDNode | RenderNode);
}
