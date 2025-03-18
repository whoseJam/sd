import { BaseHTML } from "@/Node/HTML/BaseHTML";
import { RenderNode } from "@/Renderer/RenderNode";

export class TextArea extends BaseHTML {
    constructor(target: SDNode | RenderNode);
    value(): string;
    value(value: string): this;
    onChange(callback: (value: string) => void): this;
}
