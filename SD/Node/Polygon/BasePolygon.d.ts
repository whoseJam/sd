import { SDNode } from "@/Node/SDNode";
import { Polygon } from "@/Node/SVG/Polygon";
import { RenderNode } from "@/Renderer/RenderNode";

export class BasePolygon extends Polygon {
    constructor(target: SDNode | RenderNode);
}
