import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDRule } from "@/Rule/Rule";
import { SDColor } from "@/Utility/Color";

export class BaseElement extends SD2DNode {
    constructor(target: SDNode | RenderNode, value?: any);

    rate(): number;
    rate(rate: number): this;
    color(): SDColor;
    color(color: string | SDColor): this;
    fill(): string;
    fill(fill: string): this;
    fillOpacity(): number;
    fillOpacity(opacity: number): this;
    stroke(): string;
    stroke(stroke: string): this;
    strokeOpacity(): number;
    strokeOpacity(opacity: number): this;
    strokeWidth(): number;
    strokeWidth(width: number): this;
    background(): any;
    text(): string;
    text(text: number | string): this;
    intValue(): number;
    value(): any;
    value(value: any, rule?: SDRule): this;
    valueFromExist(value: SDNode, rule?: SDRule): this;
    drop(): any;
}
