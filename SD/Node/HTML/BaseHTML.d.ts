import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class BaseHTML extends SD2DNode {
    constructor(target: SDNode | RenderNode);
}
