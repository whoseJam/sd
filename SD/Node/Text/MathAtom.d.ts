import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { HexColor, PacketColor, SDColor } from "@/Utility/Color";

export class MathAtom {
    constructor(parent: SDNode | RenderNode);

    fill(): HexColor;
    fill(fill: SDColor): this;
    stroke(): HexColor;
    stroke(stroke: SDColor): this;
    color(): PacketColor;
    color(color: SDColor): this;
}
