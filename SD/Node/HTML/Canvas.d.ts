import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Camera } from "@/Node/Three/Camera";

export class Canvas extends BaseHTML {
    constructor(target: SDNode | RenderNode);
    canvas(): RenderNode;
    three(): this;
    camera(): Camera;
}
