import { BaseControl } from "@/Node/Control/BaseControl";

export class Input extends BaseControl {
    value(): string;
    value(value: any): this;
    label(): string;
    label(label: string): this;
}
