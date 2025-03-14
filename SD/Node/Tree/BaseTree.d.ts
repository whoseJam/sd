import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { Color } from "@/Utility/Color";

type InputID = number | string;
type InputNode = InputID | SDNode;

/**
 * 树基类
 */
export class BaseTree extends SDNode {
    constructor(parent: SDNode | RenderNode);

    /**
     * 新建一个节点，并将节点编号作为节点价值物
     * @param id 节点编号
     */
    newNode(id: InputID): this;

    /**
     * 新建一个节点
     * @param id 节点编号
     * @param value 节点价值物
     */
    newNode(id: InputID, value: any): this;

    /**
     * 新建一个节点，并且这个节点的价值物是已存在的
     * @param id 节点编号
     * @param value 节点价值物
     */
    newNodeFromExistValue(id: InputID, value: SDNode): this;
    
    /**
     * 新建一个节点，并且这个节点元素是已存在的
     * @param id 节点编号
     * @param element 节点元素
     */
    newNodeFromExistElement(id: InputID, element: SDNode): this;
    
    /**
     * 新建一条连边
     * @param sourceId 起始节点编号 
     * @param targetId 终止节点编号
     */
    newLink(sourceId: InputID, targetId: InputID): this;
    
    /**
     * 新建一条连边
     * @param sourceId 起始节点编号 
     * @param targetId 终止节点编号
     * @param value 边上的价值物
     */
    newLink(sourceId: InputID, targetId: InputID, value: any): this;
    
    /**
     * 新建一条连边，并且这条边上的价值物是已存在的
     * @param sourceId 起始节点编号
     * @param targetId 终止节点编号
     * @param value 边上的价值物
     */
    newLinkFromExistValue(sourceId: InputID, targetId: InputID, value: SDNode): this;
    
    /**
     * 新建一条连边，并且这条边是已存在的
     * @param sourceId 起始节点编号
     * @param targetId 终止节点编号
     * @param element 边
     */
    newLinkFromExistElement(sourceId: InputID, targetId: InputID, element: SDNode): this;
    
    /**
     * 获取树的某个节点元素
     * @param node 节点或节点编号
     */
    element(node: InputNode): SDNode;

    /**
     * 获取树的某条边
     * @param source 起始节点或起始节点编号
     * @param target 终止节点或终止节点编号
     */
    element(source: InputNode, target: InputNode): SDNode;
    
    /**
     * 获取树上某个节点的价值物
     * @param node 节点或节点编号
     */
    value(node: InputNode): SDNode;

    /**
     * 设置树上某个节点的价值物
     * @param node 节点或节点编号 
     * @param value 节点价值物
     */
    value(node: InputNode, value: any): this;
    
    /**
     * 获取树上某条边的价值物
     * @param source 起始节点或起始节点编号
     * @param target 终止节点或终止节点编号
     */
    value(source: InputNode, target: InputNode): SDNode;
    
    /**
     * 设置图上某条边的价值物
     * @param source 起始节点或起始节点编号
     * @param target 终止节点或终止节点编号
     * @param value 边上的价值物
     */
    value(source: InputNode, target: InputNode, value: any): this;
    
    /**
     * 获取树上某个节点的透明度
     * @param node 节点或节点编号
     */
    opacity(node: InputNode): number;

    /**
     * 设置树上某个节点的透明度
     * @param node 节点或节点编号
     * @param opacity 透明度
     */
    opacity(node: InputNode, opacity: number): this;
    
    /**
     * 获取树上某条边的透明度
     * @param source 起始节点或起始节点编号
     * @param target 终止节点或终止节点编号
     */
    opacity(source: InputNode, target: InputNode): number;

    /**
     * 设置树上某条边的透明度
     * @param source 起始节点或起始节点编号
     * @param target 终止节点或终止节点编号
     * @param opacity 透明度
     */
    opacity(source: InputNode, target: InputNode, opacity: number): this;
    
    /**
     * 设置树上每个节点的颜色
     * @param color 颜色
     */
    color(color: SDColor): this;

    /**
     * 获取树上某个节点的颜色
     * @param node 
     */
    color(node: InputNode): PacketColor;

    /**
     * 设置树上某个节点的颜色
     * @param node 节点或节点编号
     * @param color 颜色
     */
    color(node: InputNode, color: SDColor): this;

    /**
     * 获取树上某条边的颜色
     * @param source 起始节点或起始节点编号
     * @param target 终止节点或终止节点编号
     */
    color(source: InputNode, target: InputNode): PacketColor;
    
    /**
     * 设置树上某条边的颜色
     * @param source 起始节点或起始节点编号
     * @param target 终止节点或终止节点编号
     * @param color 颜色
     */
    color(source: InputNode, target: InputNode, color: SDColor): this;

    /**
     * 找到第一个满足某条件的节点
     * @param condition 
     */
    findNode(condition: (node: SDNode, id: string) => boolean): SDNode | undefined;
    
    /**
     * 找到所有满足某条件的节点
     * @param condition 
     */
    findNodes(condition: (node: SDNode, id: string) => boolean): Array<SDNode>;
    
    /**
     * 找到第一个满足某条件的边
     * @param condition 
     */
    findLink(condition: (link: SDNode, sourceId: string, targetId: string) => boolean): SDNode | undefined;
    
    /**
     * 找到所有满足某条件的边
     * @param condition 
     */
    findLinks(condition: (link: SDNode, sourceId: string, targetId: string) => boolean): Array<SDNode>;
    
    /**
     * 根据节点编号寻找节点
     * @param id 节点编号
     */
    findNodeById(tid: InputID): SDNode | undefined;
    
    /**
     * 根据节点编号寻找边
     * @param sourceId 起始节点编号
     * @param targetId 终止节点编号
     */
    findLinkById(sourceId: InputID, targetId: InputID): SDNode | undefined;
    
    /**
     * 获取某节点的入边
     * @param node 节点或节点编号
     * @param mode 
     */
    inLink(node: InputNode): SDNode | undefined;
    
    /**
     * 获取某节点的所有出边
     * @param node 节点或节点编号
     * @param mode 
     */
    outLinks(node: InputNode): Array<SDNode>;

    /**
     * 获取某节点的父节点
     * @param node 节点或节点编号
     */
    father(node: InputNode): SDNode | undefined;
    
    /**
     * 获取某节点的父节点编号
     * @param node 节点或节点编号
     */
    fatherId(node: InputNode): string;

    /**
     * 获取某节点的 k 级祖先
     * @param node 节点或节点编号
     * @param kth 
     */
    ancestor(node: InputNode, kth: number): SDNode | undefined;
    
    /**
     * 获取某节点的 k 级祖先编号
     * @param node 节点或节点编号
     * @param kth 
     */
    ancestorId(node: InputNode, kth: number): string;

    /**
     * 获取树的深度
     */
    depth(): number;

    /**
     * 获取某个节点的深度
     * @param node 节点或节点编号
     */
    depth(node: InputNode): number;

    /**
     * 获取最近公共祖先
     * @param x 节点或节点编号
     * @param y 节点或节点编号
     */
    lca(x: InputNode, y: InputNode): SDNode;

    /**
     * 获取最近公共祖先编号
     * @param x 节点或节点编号
     * @param y 节点或节点编号
     */
    lcaId(x: InputNode, y: InputNode): string;

    /**
     * 获取某个节点的所有子节点
     * @param node 节点或节点编号
     */
    children(node: InputNode): Array<SDNode>;
    
    /**
     * 获取树根
     */
    root(): SDNode;

    /**
     * 新建树根，将节点编号当作树根的价值物
     * @param id 节点编号
     */
    root(id: InputID): this;

    /**
     * 新建树根，并提供树根的价值物
     * @param id 节点编号
     * @param value 树根价值物
     */
    root(id: InputID, value: any): this;

    /**
     * 连接树上两个节点
     * @param sourceId 起始节点编号
     * @param targetId 终止节点编号
     */
    link(sourceId: InputID, targetId: InputID): this;
    
    /**
     * 连接树上两个节点
     * @param sourceId 起始节点编号
     * @param targetId 终止节点编号
     * @param value 价值物
     */
    link(sourceId: InputID, targetId: InputID, value: any): this;
    
    /**
     * 删除树上两个节点之间的连边
     * @param sourceId 起始节点编号
     * @param targetId 终止节点编号
     */
    cut(sourceId: InputID, targetId: InputID): this;

    /**
     * 获取树上某节点的价值物的文本
     * @param node 节点或节点编号
     */
    text(node: InputNode): string;

    /**
     * 获取图上某条边的价值物的文本
     * @param sourceId 起始节点或起始节点编号
     * @param targetId 终止节点或终止节点编号
     */
    text(sourceId: InputID, targetId: InputID): string;

    /**
     * 获取图上某节点的价值物
     * @param node 节点或节点编号
     */
    intValue(node: InputNode): number;


    /**
     * 获取图上某条边的价值物
     * @param source 起始节点或起始节点编号
     * @param target 终止节点或终止节点编号
     */
    intValue(source: InputNode, target: InputNode): number;
    
    /**
     * 获取树上某节点子树内的所有节点
     * @param node 节点或节点编号
     */
    nodesInSubtree(node: InputNode): Array<SDNode>;
    
    /**
     * 获取树上某节点子树内的所有边
     * @param node 节点或节点编号
     */
    linksInSubtree(node: InputNode): Array<SDNode>;
    
    /**
     * 遍历树上某节点子树内的所有节点
     * @param node 节点或节点编号
     * @param callback
     */
    forEachNodeInSubtree(node: InputNode, callback: (node: SDNode, id: string) => void): this;
    
    /**
     * 遍历树上某节点子树内的所有边
     * @param node 节点或节点编号
     * @param callback
     */
    forEachLinkInSubtree(node: InputNode, callback: (link: SDNode, sourceId: string, targetId: string) => void): this;
    
    /**
     * 获取树上两个节点之间的路径上的所有节点
     * @param source 节点或节点编号
     * @param target 节点或节点编号
     */
    nodesOnPath(source: InputNode, target: InputNode): Array<SDNode>;
    
    /**
     * 获取树上两个节点之间的路径上的所有边
     * @param source 节点或节点编号
     * @param target 节点或节点编号
     */
    linksOnPath(source: InputNode, target: InputNode): Array<SDNode>;
    
    /**
     * 遍历树上两个节点之间的路径上的所有节点
     * @param source 节点或节点编号
     * @param target 节点或节点编号
     * @param callback
     */
    forEachNodeOnPath(source: InputNode, target: InputNode, callback: (node: SDNode, id: string) => void): this;
    
    /**
     * 遍历树上两个节点之间的路径上的所有边
     * @param source 节点或节点编号
     * @param target 节点或节点编号
     * @param callback
     */
    forEachLinkOnPath(source: InputNode, target: InputNode, callback: (link: SDNode, sourceId: string, targetId: string) => void): this;
    
    /**
     * 遍历图上的所有节点
     * @param callback 
     */
    forEachNode(callback: (node: SDNode, id: string) => void): this;
    
    /**
     * 遍历图上的所有边
     * @param callback 
     */
    forEachLink(callback: (link: SDNode, sourceId: string, targetId: string) => void): this;
    
    /**
     * 获取树根节点编号
     */
    rootId(): string;

    /**
     * 获取某个节点对应的节点编号
     * @param node 节点
     */
    nodeId(node: InputNode): string | undefined;

    /**
     * 获取图上所有节点的节点编号
     */
    nodesId(): Array<string>;

    /**
     * 获取某条边的起始节点编号
     * @param link 
     */
    sourceId(link: SDNode): string | undefined;

    /**
     * 获取某条边的终止节点编号
     * @param link 
     */
    targetId(link: SDNode): string | undefined;

    /**
     * 获取某条边的起始节点
     * @param link 
     */
    source(link: SDNode): SDNode | undefined;

    /**
     * 获取某条边的终止节点
     * @param link 
     */
    target(link: SDNode): SDNode | undefined;

    /**
     * 获取图上的所有节点
     */
    nodes(): Array<SDNode>;

    /**
     * 获取图上的所有边
     */
    links(): Array<SDNode>;
}
