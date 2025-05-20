import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { BaseCamera } from "@/Node/Three/Camera/BaseCamera";
import { RenderNode } from "@/Renderer/RenderNode";

export class Canvas extends BaseHTML {
    canvas(): RenderNode;
    three(): this;
    camera(): BaseCamera;
}
