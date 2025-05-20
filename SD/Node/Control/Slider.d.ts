import { BaseControl } from "@/Node/Control/BaseControl";

export class Slider extends BaseControl {
    max(): number;
    max(max: number): this;
    min(): number;
    min(min: number): this;
    value(): number;
    value(value: number): this;
}
