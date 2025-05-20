import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { PacketColor, SDColor } from "@/Utility/Color";

export class BaseControlHTML extends BaseHTML {
    constructor(target: SDNode | RenderNode, label: string);
    fill(): SDColor;
    fill(fill: SDColor): this;
    stroke(): SDColor;
    stroke(stroke: SDColor): this;
    color(): PacketColor;
    color(color: SDColor): this;
}
