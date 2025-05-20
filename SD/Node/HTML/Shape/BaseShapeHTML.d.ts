import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { PacketColor, SDColor } from "@/Utility/Color";

export class BaseShapeHTML extends BaseHTML {
    constructor(target: SDNode | RenderNode, label: string);
    fill(): SDColor;
    fill(fill: SDColor): this;
    stroke(): SDColor;
    stroke(stroke: SDColor): this;
    strokeWidth(): number;
    strokeWidth(width: number): this;
    color(): PacketColor;
    color(color: SDColor): this;
}
