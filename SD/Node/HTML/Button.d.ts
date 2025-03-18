import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { RenderNode } from "@/Renderer/RenderNode";
import { HexColor, PacketColor, SDColor } from "@/Utility/Color";

export class Button extends BaseHTML {
    constructor(target: SDNode | RenderNode);
    text(): string;
    text(text: string): this;
    onClick(callback: () => void): this;
    fill(): HexColor;
    fill(fill: HexColor): this;
    stroke(): HexColor;
    stroke(stroke: HexColor): this;
    color(): PacketColor;
    color(color: SDColor): this;
}
