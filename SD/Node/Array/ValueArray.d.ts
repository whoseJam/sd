import { Array } from "@/Node/Array/Array";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

type Align = "y" | "cy" | "my";

export class ValueArray extends Array {
    constructor(parent: SDNode | RenderNode);
    align(): Align;
    align(align: Align): this;
}
