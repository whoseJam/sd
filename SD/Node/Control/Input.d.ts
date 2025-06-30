import { BaseControl } from "@/Node/Control/BaseControl";

export class Input extends BaseControl {
    value(): string;
    value(value: number | string): this;
}
