import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { RenderNode } from "@/Renderer/RenderNode";

export class Slider extends BaseHTML {
    constructor(target: SDNode | RenderNode);
    max(): number;
    max(max: number): this;
    min(): number;
    min(min: number): this;
    value(): number;
    value(value: number): this;
    onChange(callback: (value: number) => void): this;
}
