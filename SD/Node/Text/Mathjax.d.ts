import { SDNode } from "@/Node/SDNode";
import { MathAtom } from "@/Node/Text/MathAtom";
import { RenderNode } from "@/Renderer/RenderNode";

export class Mathjax extends SDNode {
    constructor(parent: SDNode | RenderNode);
    constructor(parent: SDNode | RenderNode, text: string);

    /**
     * 设置数学公式
     * @param text
     */
    math(text: string): this;

    /**
     * 获取指定数学子公式
     * @param index
     */
    element(index: number): MathAtom;

    /**
     * 创建数学公式
     * @param index
     */
    createMath(index: number): Mathjax;

    /**
     * 做数学公式变换
     * @param text
     * @param hint
     */
    transformMath(text: string, hint: {}): this;

    /**
     * 做数学公式变换
     * @param text
     * @param math
     * @param hint
     */
    transformMathFrom(text: string, math: Array<Mathjax>, hint: {}): this;
}
