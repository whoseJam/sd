import { SD2DNode } from "@/Node/SD2DNode";
import { SDNode } from "@/Node/SDNode";
import { SDColor } from "@/Utility/Color";

type GraphMode = "direct" | "undirect";

export class BaseGraph extends SD2DNode {
    nodes(): Array<SDNode>;
    nodesId(): Array<string>;
    element(node: number | string | SDNode): SDNode | undefined;
    nodeId(node: number | string | SDNode): string | undefined;

    links(): Array<SDNode>;
    element(source: number | string | SDNode, target: number | string | SDNode): SDNode | undefined;
    source(link: SDNode): SDNode | undefined;
    target(link: SDNode): SDNode | undefined;
    sourceId(link: SDNode): string | undefined;
    targetId(link: SDNode): string | undefined;
    toNode(link: SDNode, source: number | string | SDNode): string | undefined;
    toNodeId(link: SDNode, source: number | string | SDNode): string | undefined;

    findNode(condition: (node: SDNode, id: string) => boolean): SDNode | undefined;
    findNodes(condition: (node: SDNode, id: string) => boolean): Array<SDNode>;
    findLink(condition: (link: SDNode, sourceId: string, targetId: string) => boolean): SDNode | undefined;
    findLinks(condition: (link: SDNode, sourceId: string, targetId: string) => boolean): Array<SDNode>;
    findNodeById(id: number | string): SDNode | undefined;
    findLinkById(sourceId: number | string, targetId: number | string): SDNode | undefined;

    inLinks(node: number | string | SDNode, mode: GraphMode): Array<SDNode>;
    outLinks(node: number | string | SDNode, mode: GraphMode): Array<SDNode>;
    inNodes(node: number | string | SDNode, mode: GraphMode): Array<SDNode>;
    inNodesId(node: number | string | SDNode, mode: GraphMode): Array<string>;
    outNodes(node: number | string | SDNode, mode: GraphMode): Array<SDNode>;
    outNodesId(node: number | string | SDNode, mode: GraphMode): Array<string>;
    forEachInNode(node: number | string | SDNode, mode: GraphMode, callback: (node: SDNode, id: string) => void): this;
    forEachInLink(node: number | string | SDNode, mode: GraphMode, callback: (link: SDNode, sourceId: string, targetId: string) => void): this;
    forEachOutNode(node: number | string | SDNode, mode: GraphMode, callback: (node: SDNode, id: string) => void): this;
    forEachOutLink(node: number | string | SDNode, mode: GraphMode, callback: (link: SDNode, sourceId: string, targetId: string) => void): this;
    forEachNode(callback: (node: SDNode, id: string) => void): this;
    forEachLink(callback: (link: SDNode, sourceId: string, targetId: string) => void): this;

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
    linkOpacity(source: number | string | SDNode, target: number | string | SDNode, opacity: number): this;
    color(color: SDColor | string): this;
    color(node: number | string | SDNode): SDColor;
    color(node: number | string | SDNode, color: SDColor | string): this;
    color(source: number | string | SDNode, target: number | string | SDNode): SDColor;
    color(source: number | string | SDNode, target: number | string | SDNode, color: SDColor | string): this;
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
