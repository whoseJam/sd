import { SDNode } from "@/Node/SDNode";
import { RenderNode } from "@/Renderer/RenderNode";
import { PacketColor, SDColor } from "@/Utility/Color";

type GraphMode = "direct" | "undirect";
type InputID = InputID;
type InputNode = InputID | SDNode;

export class BaseGraph extends SDNode {
    constructor(target: SDNode | RenderNode);
    newNode(id: InputID, value?: any): this;
    newNodeFromExistValue(id: InputID, value: SDNode): this;
    newNodeFromExistElement(id: InputID, element: SDNode): this;
    newLink(sourceId: InputID, targetId: InputID, value?: any): this;
    newLinkFromExistValue(sourceId: InputID, targetId: InputID, value: SDNode): this;
    newLinkFromExistElement(sourceId: InputID, targetId: InputID, element: SDNode): this;
    element(node: InputNode): SDNode;
    element(source: InputNode, target: InputNode): SDNode;
    value(node: InputNode): SDNode;
    value(node: InputNode, value: any): this;
    value(source: InputNode, target: InputNode): SDNode;
    value(source: InputNode, target: InputNode, value: any): this;
    opacity(node: InputNode): number;
    opacity(node: InputNode, opacity: number): this;
    opacity(source: InputNode, target: InputNode): number;
    opacity(source: InputNode, target: InputNode, opacity: number): this;
    color(color: SDColor): this;
    color(node: InputNode): PacketColor;
    color(node: InputNode, color: SDColor): this;
    color(source: InputNode, target: InputNode): PacketColor;
    color(source: InputNode, target: InputNode, color: SDColor): this;
    findNode(condition: (node: SDNode, id: string) => boolean): SDNode | undefined;
    findNodes(condition: (node: SDNode, id: string) => boolean): Array<SDNode>;
    findLink(condition: (link: SDNode, sourceId: string, targetId: string) => boolean): SDNode | undefined;
    findLinks(condition: (link: SDNode, sourceId: string, targetId: string) => boolean): Array<SDNode>;
    findNodeById(id: InputID): SDNode;
    findLinkById(sourceId: InputID, targetId: InputID): SDNode;
    inLinks(node: InputNode, mode: GraphMode): Array<SDNode>;
    outLinks(node: InputNode, mode: GraphMode): Array<SDNode>;
    inNodes(node: InputNode, mode: GraphMode): Array<SDNode>;
    inNodesId(node: InputNode, mode: GraphMode): Array<string>;
    outNodes(node: InputNode, mode: GraphMode): Array<SDNode>;
    outNodesId(node: InputNode, mode: GraphMode): Array<string>;
    link(sourceId: InputID, targetId: InputID): this;
    link(sourceId: InputID, targetId: InputID, value: any): this;
    cut(sourceId: InputID, targetId: InputID): this;
    text(node: InputNode): string;
    text(source: InputNode, target: InputNode): string;
    intValue(node: InputNode): number;
    intValue(source: InputNode, target: InputNode): number;
    forEachInNode(node: InputNode, mode: GraphMode, callback: (node: SDNode, id: string) => void): this;
    forEachInLink(node: InputNode, mode: GraphMode, callback: (link: SDNode, sourceId: string, targetId: string) => void): this;
    forEachOutNode(node: InputNode, mode: GraphMode, callback: (node: SDNode, id: string) => void): this;
    forEachOutLink(node: InputNode, mode: GraphMode, callback: (link: SDNode, sourceId: string, targetId: string) => void): this;
    forEachNode(callback: (node: SDNode, id: string) => void): this;
    forEachLink(callback: (link: SDNode, sourceId: string, targetId: string) => void): this;
    nodeId(node: SDNode): string | undefined;
    nodesId(): Array<string>;
    sourceId(link: SDNode): string | undefined;
    targetId(link: SDNode): string | undefined;
    source(link: SDNode): SDNode | undefined;
    target(link: SDNode): SDNode | undefined;
    toNode(link: SDNode, source: InputNode): string;
    toNodeId(link: SDNode, source: InputNode): string;
    nodes(): Array<SDNode>;
    links(): Array<SDNode>;
}
