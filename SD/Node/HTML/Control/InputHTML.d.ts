import { BaseControlHTML } from "@/Node/HTML/Control/BaseControlHTML";

export class InputHTML extends BaseControlHTML {
    value(): string;
    value(value: any): this;
    label(): string;
    label(label: string): this;
}
