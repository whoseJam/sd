import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { BaseShape } from "@/Node/Shape/BaseShape";
import { RenderNode } from "@/Renderer/RenderNode";
import { SDRule } from "@/Rule/Rule";
import { SDColor } from "@/Utility/Color";

export class BaseElement extends SD2DNode {
    constructor(target: SDNode | RenderNode, value?: any);

    rate(): number;
    rate(rate: number): this;
    color(): SDColor;
    color(color: SDColor | string): this;
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

    background(): BaseShape;

    text(): string;
    text(text: number | string): this;
    intValue(): number;
    value(): SD2DNode | undefined;
    value(value: any, rule?: SDRule): this;
    valueFromExist(value: SD2DNode, rule?: SDRule): this;
    drop(): SD2DNode | undefined;
}
