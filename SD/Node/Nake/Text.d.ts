import { BaseNake } from "@/Node/Nake/BaseNake";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Text extends BaseNake {
    constructor(parent: SDNode | RenderNode);
    constructor(parent: SDNode | RenderNode, text: number | string);

    /**
     * 获取字体大小
     */
    fontSize(): number;

    /**
     * 设置字体大小
     * @param fontSize
     */
    fontSize(fontSize: number): this;

    /**
     * 获取文本
     */
    text(): string;

    /**
     * 设置文本
     * @param text
     */
    text(text: string): this;
}
