import { Vertex } from "@/Node/Element/Vertex";
import { Line } from "@/Node/Path/Line";
import { SD2DNode } from "@/Node/SD2DNode";
import { BaseTree } from "@/Node/Tree/BaseTree";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";
import { trim } from "@/Utility/Trim";

export function BaseGraph(parent) {
    SD2DNode.call(this, parent);

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

    this.effect("links", () => {
        this.forEachLink((link, sourceId, targetId) => {
            const source = this.findNodeById(sourceId);
            const target = this.findNodeById(targetId);
            this.tryUpdate(link, () => {
                link.source(source.center());
                link.target(target.center());
                if (link.effect("curve")) link.triggerEffect("curve");
                trim(link, source, target);
                if (link.effect("curve")) link.triggerEffect("curve");
            });
        });
    });
}

BaseGraph.prototype = {
    ...SD2DNode.prototype,
    BASE_GRAPH: true,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    width: Factory.handlerLowPrecise("width"),
    height: Factory.handlerLowPrecise("height"),
    element: BaseTree.prototype.element,

    nodes: BaseTree.prototype.nodes,
    nodesId: BaseTree.prototype.nodesId,
    nodeId: BaseTree.prototype.nodeId,

    links: BaseTree.prototype.links,
    source: BaseTree.prototype.source,
    target: BaseTree.prototype.target,
    sourceId: BaseTree.prototype.sourceId,
    targetId: BaseTree.prototype.targetId,
    toNode(link, source) {
        const sourceId = this.nodeId(source);
        if (this.sourceId(link) === sourceId) return this.target(link);
        else if (this.targetId(link) === sourceId) return this.source(link);
        else return undefined;
    },
    toNodeId(link, source) {
        return this.nodeId(this.toNode(link, source));
    },

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

    link: BaseTree.prototype.link,
    newNode() {
        ErrorLauncher.notImplementedYet("newNode", this.type());
    },
    newNodeFromExistValue() {
        ErrorLauncher.notImplementedYet("newNodeFromExistValue", this.type());
    },
    newNodeFromExistElement() {
        ErrorLauncher.notImplementedYet("newNodeFromExistElement", this.type());
    },
    newLink() {
        ErrorLauncher.notImplementedYet("newLink", this.type());
    },
    newLinkFromExistValue() {
        ErrorLauncher.notImplementedYet("newLinkFromExistValue", this.type());
    },
    newLinkFromExistElement() {
        ErrorLauncher.notImplementedYet("newLinkFromExistElement", this.type());
    },
    cut: BaseTree.prototype.cut,

    opacity: BaseTree.prototype.opacity,
    nodeOpacity: BaseTree.prototype.nodeOpacity,
    linkOpacity: BaseTree.prototype.linkOpacity,
    color: BaseTree.prototype.color,
    text: BaseTree.prototype.text,
    nodeText: BaseTree.prototype.nodeText,
    linkText: BaseTree.prototype.linkText,
    intValue: BaseTree.prototype.intValue,
    value: BaseTree.prototype.value,
    nodeValue: BaseTree.prototype.nodeValue,
    linkValue: BaseTree.prototype.linkValue,

    linkType: BaseTree.prototype.linkType,
    nodeType: BaseTree.prototype.nodeType,

    __insertNode(id, element) {
        id = String(id);
        this._.sdnodesMap[element.id] = { node: element, id };
        this._.nodesMap[id] = element;
        this.childAs(element);
        this.vars.nodes.push(element);
        return this;
    },
    __insertLink(sourceId, targetId, element) {
        [sourceId, targetId] = [String(sourceId), String(targetId)];
        this._.sdnodesMap[element.id] = { link: element, sourceId, targetId };
        this._.linksMap[`${sourceId}-${targetId}`] = element;
        this.childAs(element);
        this.vars.links.push(element);
        return this;
    },
    __getNodeWithMethod: BaseTree.prototype.__getNodeWithMethod,
    __getLinkWithMethod: BaseTree.prototype.__getLinkWithMethod,
};
