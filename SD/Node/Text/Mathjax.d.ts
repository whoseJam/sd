import { SDNode } from "@/Node/SDNode";
import { MathAtom } from "@/Node/Text/MathAtom";
import { RenderNode } from "@/Renderer/RenderNode";

export class Mathjax extends SDNode {
    constructor(target: SDNode | RenderNode);
    constructor(target: SDNode | RenderNode, text: string);

    math(text: string): this;
    createMath(id: number): Mathjax;
    transformMath(text: string, relations: {}): this;
    transformMathFrom(text: string, others: Array<Mathjax>, relations: {}): this;

    element(id: number): MathAtom;
}
