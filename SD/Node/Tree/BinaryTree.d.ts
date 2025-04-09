import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";

export class BinaryTree extends BaseTree {
    layerHeight(): number;
    layerHeight(height: number): this;

    leftChild(parentId: number | string, childId: number | string): this;
    leftChild(parentId: number | string, childId: number | string, value: any): this;
    leftChild(node: number | string | SDNode);
    leftChildId(node: number | string | SDNode): string;
    rightChild(parentId: number | string, childId: number | string): this;
    rightChild(parentId: number | string, childId: number | string, value: any): this;
    rightChild(node: number | string | SDNode): SDNode;
    rightChildId(node: number | string | SDNode): string;

    swapChildren(node: number | string | SDNode): this;
    nodesOnPreorderTraversal(node?: number | string | SDNode): Array<SDNode>;
    nodesOnInorderTraversal(node?: number | string | SDNode): Array<SDNode>;
    nodesOnPostorderTraversal(node?: number | string | SDNode): Array<SDNode>;
    forEachNodeOnPreorderTraversal(callback: (node: SDNode, id: number) => void): this;
    forEachNodeOnPreorderTraversal(node: number | string | SDNode, callback: (node: SDNode, id: number) => void): this;
    forEachNodeOnInorderTraversal(callback: (node: SDNode, id: number) => void): this;
    forEachNodeOnInorderTraversal(node: number | string | SDNode, callback: (node: SDNode, id: number) => void): this;
    forEachNodeOnPostorderTraversal(callback: (node: SDNode, id: number) => void): this;
    forEachNodeOnPostorderTraversal(node: number | string | SDNode, callback: (node: SDNode, id: number) => void): this;
}
