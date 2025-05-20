import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { PacketColor, SDColor } from "@/Utility/Color";

export class BaseTree extends SD2DNode {
    nodes(): Array<SDNode>;
    nodesId(): Array<string>;
    element(node: number | string | SDNode): SDNode | undefined;
    root(): SDNode;
    rootId(): string;
    nodeId(node: number | string | SDNode): string | undefined;

    links(): Array<SDNode>;
    element(source: number | string | SDNode, target: number | string | SDNode): SDNode | undefined;
    source(link: SDNode): SDNode | undefined;
    target(link: SDNode): SDNode | undefined;
    sourceId(link: SDNode): string | undefined;
    targetId(link: SDNode): string | undefined;

    findNode(condition: (node: SDNode, id: string) => boolean): SDNode | undefined;
    findNodes(condition: (node: SDNode, id: string) => boolean): Array<SDNode>;
    findLink(condition: (link: SDNode, sourceId: string, targetId: string) => boolean): SDNode | undefined;
    findLinks(condition: (link: SDNode, sourceId: string, targetId: string) => boolean): Array<SDNode>;
    findNodeById(id: number | string): SDNode | undefined;
    findLinkById(sourceId: number | string, targetId: number | string): SDNode | undefined;

    inLink(node: number | string | SDNode): SDNode | undefined;
    outLinks(node: number | string | SDNode): Array<SDNode>;
    children(node: number | string | SDNode): Array<SDNode>;
    father(node: number | string | SDNode): SDNode | undefined;
    fatherId(node: number | string | SDNode): string | undefined;
    depth(): number;
    depth(node: number | string | SDNode): number;
    ancestor(node: number | string | SDNode, kth: number): SDNode | undefined;
    ancestorId(node: number | string | SDNode, kth: number): string | undefined;

    lca(x: number | string | SDNode, y: number | string | SDNode): SDNode;
    lcaId(x: number | string | SDNode, y: number | string | SDNode): string;
    nodesInSubtree(node: number | string | SDNode): Array<SDNode>;
    linksInSubtree(node: number | string | SDNode): Array<SDNode>;
    forEachNodeInSubtree(node: number | string | SDNode, callback: (node: SDNode, id: string) => void): this;
    forEachLinkInSubtree(node: number | string | SDNode, callback: (link: SDNode, sourceId: string, targetId: string) => void): this;
    nodesOnPath(source: number | string | SDNode, target: number | string | SDNode): Array<SDNode>;
    linksOnPath(source: number | string | SDNode, target: number | string | SDNode): Array<SDNode>;
    forEachNodeOnPath(source: number | string | SDNode, target: number | string | SDNode, callback: (node: SDNode, id: string) => void): this;
    forEachLinkOnPath(source: number | string | SDNode, target: number | string | SDNode, callback: (link: SDNode, sourceId: string, targetId: string) => void): this;
    forEachNode(callback: (node: SDNode, id: string) => void): this;
    forEachLink(callback: (link: SDNode, sourceId: string, targetId: string) => void): this;

    root(id: number | string, value?: any): this;
    link(sourceId: number | string, targetId: number | string, value?: any): this;
    newNode(id: number | string, value?: any): this;
    newNodeFromExistValue(id: number | string, value: SDNode): this;
    newNodeFromExistElement(id: number | string, element: SDNode): this;
    newLink(sourceId: number | string, targetId: number | string, value?: any): this;
    newLinkFromExistValue(sourceId: number | string, targetId: number | string, value: SDNode): this;
    newLinkFromExistElement(sourceId: number | string, targetId: number | string, element: SDNode): this;
    cut(sourceId: number | string, targetId: number | string): this;

    opacity(node: number | string | SDNode): number;
    opacity(node: number | string | SDNode, opacity: number): this;
    nodeOpacity(node: number | string | SDNode): number;
    nodeOpacity(node: number | string | SDNode, opacity: number): this;
    opacity(source: number | string | SDNode, target: number | string | SDNode): number;
    opacity(source: number | string | SDNode, target: number | string | SDNode, opacity: number): this;
    linkOpacity(source: number | string | SDNode, target: number | string | SDNode): number;
    linkOpacity(source: number | string | SDNode, target: number | string | SDNode): number;
    color(color: SDColor): this;
    color(node: number | string | SDNode): PacketColor;
    color(node: number | string | SDNode, color: SDColor): this;
    color(source: number | string | SDNode, target: number | string | SDNode): PacketColor;
    color(source: number | string | SDNode, target: number | string | SDNode, color: SDColor): this;
    text(node: number | string | SDNode): string;
    text(node: number | string | SDNode, text: string): this;
    nodeText(node: number | string | SDNode): string;
    nodeText(node: number | string | SDNode, text: string): this;
    text(source: number | string | SDNode, target: number | string | SDNode): string;
    text(source: number | string | SDNode, target: number | string | SDNode, text: string): this;
    linkText(source: number | string | SDNode, target: number | string | SDNode): string;
    linkText(source: number | string | SDNode, target: number | string | SDNode, text: string): this;
    intValue(node: number | string | SDNode): number;
    intValue(source: number | string | SDNode, target: number | string | SDNode): number;
    value(node: number | string | SDNode): SDNode | undefined;
    value(node: number | string | SDNode, value: any): this;
    nodeValue(node: number | string | SDNode): SDNode | undefined;
    nodeValue(node: number | string | SDNode, value: any): this;
    value(source: number | string | SDNode, target: number | string | SDNode): SDNode | undefined;
    value(source: number | string | SDNode, target: number | string | SDNode, value: any): this;
    linkValue(source: number | string | SDNode, target: number | string | SDNode): SDNode | undefined;
    linkValue(source: number | string | SDNode, target: number | string | SDNode, value: any): this;

    linkType(type: any): this;
    nodeType(type: any): this;
}
