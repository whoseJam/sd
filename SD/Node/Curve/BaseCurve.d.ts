import { SDNode } from "@/Node/SDNode";
import { Path } from "@/Node/SVG/Path";
import { RenderNode } from "@/Renderer/RenderNode";

export class BaseCurve extends Path {
    constructor(target: SDNode | RenderNode);
}
