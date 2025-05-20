import { BaseControlHTML } from "@/Node/HTML/Control/BaseControlHTML";

export class TextAreaHTML extends BaseControlHTML {
    value(): string;
    value(value: string): this;
}
