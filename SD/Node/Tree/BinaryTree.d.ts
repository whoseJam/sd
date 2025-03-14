import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { RenderNode } from "@/Renderer/RenderNode";

type InputID = number | string;
type InputNode = InputID | SDNode;

/**
 * 二叉树
 */
export class BinaryTree extends BaseTree {
    constructor(parent: SDNode | RenderNode);

    /**
     * 设置某节点的左儿子
     * @param parentId 
     * @param childId 
     */
    leftChild(parentId: InputID, childId: InputID): this;
    
    /**
     * 设置某节点的左儿子
     * @param parentId 
     * @param childId 
     * @param value 左儿子的价值物
     */
    leftChild(parentId: InputID, childId: InputID, value: any): this;
    
    /**
     * 获取某节点的左儿子
     * @param node 
     */
    leftChild(node: InputNode);

    /**
     * 获取某节点的左儿子编号
     * @param node 
     */
    leftChildId(node: InputNode): string;

    /**
     * 设置某节点的右儿子
     * @param parentId 
     * @param childId 
     */
    rightChild(parentId: InputID, childId: InputID): this;
    
    /**
     * 设置某节点的右儿子
     * @param parentId 
     * @param childId 
     * @param value 右儿子的价值物
     */
    rightChild(parentId: InputID, childId: InputID, value: any): this;
    
    /**
     * 获取某节点的右儿子
     * @param node 
     */
    rightChild(node: InputNode): SDNode;

    /**
     * 获取某节点的右儿子编号
     * @param node 
     */
    rightChildId(node: InputNode): string;
}