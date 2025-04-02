import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { RenderNode } from "@/Renderer/RenderNode";

type InputID = number | string;
type InputNode = InputID | SDNode;

export class BinaryTree extends BaseTree {
    constructor(target: SDNode | RenderNode);
    leftChild(parentId: InputID, childId: InputID): this;
    leftChild(parentId: InputID, childId: InputID, value: any): this;
    leftChild(node: InputNode);
    leftChildId(node: InputNode): string;
    rightChild(parentId: InputID, childId: InputID): this;
    rightChild(parentId: InputID, childId: InputID, value: any): this;
    rightChild(node: InputNode): SDNode;
    rightChildId(node: InputNode): string;
}
