import { BaseText } from "@/Node/Text/BaseText";
import { MathAtom } from "@/Node/Text/MathAtom";

export class Mathjax extends BaseText {
    math(text: string): this;
    createMath(id: number): Mathjax;
    transformMath(text: string, relations: {}): this;
    transformMathFrom(text: string, others: Array<Mathjax>, relations: {}): this;

    element(id: number): MathAtom;
}
