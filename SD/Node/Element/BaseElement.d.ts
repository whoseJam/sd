import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDRule } from "@/Rule/Rule";
import { HexColor, PacketColor, SDColor } from "@/Utility/Color";

export class BaseElement extends SDNode {
    constructor(target: SDNode | RenderNode);
    rate(): number;
    rate(rate: number): this;
    color(): PacketColor;
    color(color: SDColor): this;
    fill(): HexColor;
    fill(fill: HexColor): this;
    fillOpacity(): number;
    fillOpacity(opacity: number): this;
    stroke(): HexColor;
    stroke(stroke: HexColor): this;
    strokeOpacity(): number;
    strokeOpacity(opacity: number): this;
    strokeWidth(): number;
    strokeWidth(width: number): this;
    background(): SDNode;
    text(): string;
    text(text: string): this;
    drop(): this;
    intValue(): number;
    value(): SDNode | undefined;
    value(value: any, rule?: SDRule): this;
    valueFromExist(value: SDNode, rule?: SDRule): this;
}
