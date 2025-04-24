import { BaseArray } from "@/Node/Array/BaseArray";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Code extends BaseArray {
    constructor(target: SDNode | RenderNode, source?: string);
    l(): number;
    r(): number;
    fontSize(): number;
    fontSize(fontSize: number): this;
    code(source: string): this;
    focus(row: number | false | null | undefined): this;
    focus(l: number, r: number): this;
}
