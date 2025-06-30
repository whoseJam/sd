import { BaseControl } from "@/Node/Control/BaseControl";

export class TextArea extends BaseControl {
    value(): string;
    value(value: number | string): this;
}
