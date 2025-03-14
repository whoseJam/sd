import { SDNode } from "@/Node/SDNode";

/**
 * 定义了当一个 SDNode 在与另一个 SDNode 脱离父子关系的过程中，应该如何执行过渡动画
 */
export class Exit {
    /**
     * 子节点逐渐从不透明变成透明，从正确的位置上消失
     */
    static fade(): (element: SDNode) => void;

    /**
     * 子节点从父节点上脱落到场景中，但不修改自己的位置，也不改变自己的透明度
     */
    static drop(): (element: SDNode) => void;
}

export function exit(): typeof Exit;
