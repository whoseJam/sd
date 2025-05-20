import { BaseControl } from "@/Node/Control/BaseControl";

export class Button extends BaseControl {
    text(): string;
    text(text: string): this;
}
