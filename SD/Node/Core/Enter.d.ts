import { SDNode } from "@/Node/SDNode";

/**
 * 进入动画模块
 *
 * 定义了当一个 SDNode 在成为另一个 SDNode 的子节点的过程中，应该如何执行过渡动画
 */
export class Enter {
    /**
     * 子节点逐渐从透明变成不透明，浮现到正确位置上
     */
    static appear(): (element: SDNode, move: () => void) => void;

    /**
     * 子节点逐渐从透明变成不透明，浮现到正确位置上
     * @param layer
     */
    static appear(layer: string): (element: SDNode, move: () => void) => void;

    /**
     * 仅对线类子节点生效，子节点从线头到线尾逐渐浮现
     */
    static pointStoT(): (element: SDNode, move: () => void) => void;

    /**
     * 仅对线类子节点生效，子节点从线头到线尾逐渐浮现
     * @param layer
     */
    static pointStoT(layer: string): (element: SDNode, move: () => void) => void;

    /**
     * 子节点从原本所在的位置平移到正确位置
     */
    static moveTo(): (element: SDNode, move: () => void) => void;

    /**
     * 子节点从原本所在的位置平移到正确位置
     * @param layer
     */
    static moveTo(layer: string): (element: SDNode, move: () => void) => void;
}

export function enter(): typeof Enter;
