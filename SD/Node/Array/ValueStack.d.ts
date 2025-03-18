import { Stack } from "@/Node/Array/Stack";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

type Align = "x" | "cx" | "mx";

export class ValueStack extends Stack {
    constructor(target: SDNode | RenderNode);
    align(): Align;
    align(align: Align): this;
}
