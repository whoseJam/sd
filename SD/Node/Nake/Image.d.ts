import { BaseNake } from "@/Node/Nake/BaseNake";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

type ApsectRatio = "XMinYMin meet" | "XMinYMin slice" | "XMinYMid meet" | "XMinYMid slice" | "XMinYMax meet" | "XMinYMax slice" | "XMidYMin meet" | "XMidYMin slice" | "XMidYMid meet" | "XMidYMid slice" | "XMidYMax meet" | "XMidYMax slice" | "XMaxYMin meet" | "XMaxYMin slice" | "XMaxYMid meet" | "XMaxYMid slice" | "XMaxYMax meet" | "XMaxYMax slice";

export class Image extends BaseNake {
    constructor(parent: SDNode | RenderNode);

    /**
     * 获取图片链接
     */
    href(): string;

    /**
     * 设置图片链接
     * @param href
     */
    href(href: string): void;
    aspectRatio(): string;
    aspectRatio(aspectRatio: ApsectRatio): this;
}
