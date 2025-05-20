import { BaseControlSVG } from "@/Node/SVG/Control/BaseControlSVG";

export class InputSVG extends BaseControlSVG {
    value(): string;
    value(value: any): this;
    label(): string;
    label(label: string): this;
}
