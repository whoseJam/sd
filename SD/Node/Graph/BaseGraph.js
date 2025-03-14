import { Vertex } from "@/Node/Element/Vertex";
import { Line } from "@/Node/Nake/Line";
import { SDNode } from "@/Node/SDNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { Factory } from "@/Utility/Factory";

export function BaseGraph(parent) {
    SDNode.call(this, parent);

    this.newLayer("nodes");
    this.newLayer("links");

    this.vars.merge({
        x: 0,
        y: 0,
        width: 300,
        height: 300,
        links: [],
        nodes: [],
    });

    this._.sdnodesMap = {}; // SDNode id -> { node: SDNode, id: GraphID } | { link: SDNode, sourceId: GraphId, targetId: GraphID }
    this._.nodesMap = {}; // GraphID -> SDNode
    this._.linksMap = {}; // GraphID-GraphID -> SDNode
    this._.nodeType = Vertex;
    this._.linkType = Line;

    this._.BASE_GRAPH = true;
}

BaseGraph.prototype = {
    ...SDNode.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
    color: BaseTree.prototype.color,
    value: BaseTree.prototype.value,
    element: BaseTree.prototype.element,
    opacity: BaseTree.prototype.opacity,
    findNode: BaseTree.prototype.findNode,
    findNodes: BaseTree.prototype.findNodes,
    findLink: BaseTree.prototype.findLink,
    findLinks: BaseTree.prototype.findLinks,
    findNodeById: BaseTree.prototype.findNodeById,
    findLinkById: BaseTree.prototype.findLinkById,
    inLinks(node, mode) {
        node = this.nodeId(node);
        return this.findLinks((link, sourceId, targetId) => targetId === node || (mode === "undirect" && sourceId === node));
    },
    outLinks(node, mode) {
        node = this.nodeId(node);
        return this.findLinks((link, sourceId, targetId) => sourceId === node || (mode === "undirect" && targetId === node));
    },
    inNodes(node, mode) {
        return this.inLinks(node, mode).map(link => this.toNode(link, node));
    },
    inNodesId(node, mode) {
        return this.inNodes(node, mode).map(node => this.nodeId(node));
    },
    outNodes(node, mode) {
        return this.outLinks(node, mode).map(link => this.toNode(link, node));
    },
    outNodesId(node, mode) {
        return this.outNodes(node, mode).map(node => this.toNodeId(node));
    },
    newNodeByBaseGraph(id, element) {
        id = String(id);
        this._.sdnodesMap[element.id] = { node: element, id };
        this._.nodesMap[id] = element;
        this.childAs(element);
        this.vars.nodes.push(element);
        return this;
    },
    newLinkByBaseGraph(sourceId, targetId, element) {
        [sourceId, targetId] = [String(sourceId), String(targetId)];
        this._.sdnodesMap[element.id] = { link: element, sourceId, targetId };
        this._.linksMap[`${sourceId}-${targetId}`] = element;
        this.childAs(element);
        this.vars.links.push(element);
        return this;
    },
    link: BaseTree.prototype.link,
    cut: BaseTree.prototype.cut,
    text: BaseTree.prototype.text,
    intValue: BaseTree.prototype.intValue,
    forEachInNode(node, mode, callback) {
        this.inNodes(node, mode).forEach(node => {
            callback(node, this.nodeId(node));
        });
    },
    forEachInLink(node, mode, callback) {
        this.inLinks(node, mode).forEach(link => {
            callback(link, this.sourceId(link), this.targetId(link));
        });
    },
    forEachOutNode(node, mode, callback) {
        this.outNodes(node, mode).forEach(node => {
            callback(node, this.nodeId(node));
        });
    },
    forEachOutLink(node, mode, callback) {
        this.outLinks(node, mode).forEach(link => {
            callback(link, this.sourceId(link), this.targetId(link));
        });
    },
    forEachNode: BaseTree.prototype.forEachNode,
    forEachLink: BaseTree.prototype.forEachLink,
    nodeId: BaseTree.prototype.nodeId,
    nodesId: BaseTree.prototype.nodesId,
    sourceId: BaseTree.prototype.sourceId,
    targetId: BaseTree.prototype.targetId,
    source: BaseTree.prototype.source,
    target: BaseTree.prototype.target,
    nodes: BaseTree.prototype.nodes,
    links: BaseTree.prototype.links,
    toNode(link, source) {
        const sourceId = this.nodeId(source);
        if (this.sourceId(link) === sourceId) return this.target(link);
        return this.source(link);
    },
    toNodeId(link, source) {
        return this.nodeId(this.toNode(link, source));
    },
};
