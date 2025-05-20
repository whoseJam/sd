import { BaseControlSVG } from "@/Node/SVG/Control/BaseControlSVG";

export class SliderSVG extends BaseControlSVG {
    max(): number;
    max(max: number): this;
    min(): number;
    min(min: number): this;
    value(): number;
    value(value: number): this;
}
