import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { HexColor, PacketColor, SDColor } from "@/Utility/Color";

export class BaseSVG extends SD2DNode {
    constructor(target: SDNode | RenderNode, tag: string);

    fill(): HexColor;
    fill(fill: SDColor): this;
    fillOpacity(): number;
    fillOpacity(opacity: number): this;
    stroke(): HexColor;
    stroke(stroke: SDColor): this;
    strokeOpacity(): number;
    strokeOpacity(opacity: number): this;
    strokeWidth(): number;
    strokeWidth(width: number): this;
    strokeDashOffset(): number;
    strokeDashOffset(offset: number): this;
    strokeDashArray(): Array<number>;
    strokeDashArray(array: Array<number>): this;
    color(): PacketColor;
    color(color: SDColor): this;
}
