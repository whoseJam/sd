import { BaseControl } from "@/Node/Control/BaseControl";

export class TextArea extends BaseControl {
    value(): string;
    value(value: number | string): this;
    onChange(onChange: (value: string) => void): this;
    onChange(onChange: false | null | undefined): this;
}
