import { Array } from "@/Node/Array/Array";
import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";

export class Stack extends Array {
    constructor(parent: SDNode | RenderNode);
}
