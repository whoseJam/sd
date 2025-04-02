import { Enter } from "@/Node/Core/Enter";
import { Tree } from "@/Node/Tree/Tree";
import { Cast } from "@/Utility/Cast";
import { trim } from "@/Utility/Trim";

export function BinaryTree(parent) {
    Tree.call(this, parent);

    this.type("BinaryTree");

    this._.biChildren = {};

    this.uneffect("tree");
    this.effect("binaryTree", () => {
        BinaryTreeLayout.apply(this, ["vertical"]);
    });
}

BinaryTree.prototype = {
    ...Tree.prototype,
};

BinaryTree.prototype.newNode = function (id, value) {
    const element = new this._.nodeType(this.layer("nodes")).opacity(0);
    this._.biChildren[element.id] = [undefined, undefined];
    element.value(Cast.castToSDNode(element, value, id));
    element.onEnter(Enter.appear("nodes"));
    this.newNodeByBaseTree(id, element);
    return this;
};

BinaryTree.prototype.newLink = function (sourceId, targetId, type, value = null) {
    [sourceId, targetId] = [String(sourceId), String(targetId)];
    if (type === undefined) {
        if (!this._.biChildren[this.element(sourceId).id][0]) {
            this._.biChildren[this.element(sourceId).id][0] = targetId;
        } else {
            this._.biChildren[this.element(sourceId).id][1] = targetId;
        }
    } else {
        this._.biChildren[this.element(sourceId).id][type] = targetId;
    }
    const element = new this._.linkType(this.layer("links")).opacity(0);
    element.value(value);
    element.onEnter(Enter.appear("links"));
    this.newLinkByBaseTree(sourceId, targetId, element);
    return this;
};

BinaryTree.prototype.leftChild = function (sourceId, targetId, value = null) {
    if (arguments.length === 1) return this.findNodeById(this._.biChildren[this.element(sourceId).id][0]);
    if (!this.findNodeById(sourceId)) this.newNode(sourceId);
    if (!this.findNodeById(targetId)) this.newNode(targetId);
    this.newLink(sourceId, targetId, 0, value);
    return this;
};

BinaryTree.prototype.rightChild = function (sourceId, targetId, value = null) {
    if (arguments.length === 1) return this.findNodeById(this._.biChildren[this.element(sourceId).id][1]);
    if (!this.findNodeById(sourceId)) this.newNode(sourceId);
    if (!this.findNodeById(targetId)) this.newNode(targetId);
    this.newLink(sourceId, targetId, 1, value);
    return this;
};

BinaryTree.prototype.leftChildId = function (node) {
    return this.nodeId(this.leftChild(node));
};

BinaryTree.prototype.rightChildId = function (node) {
    return this.nodeId(this.rightChild(node));
};

BinaryTree.prototype.link = function (x, y, dir, value = null) {
    if (dir === undefined) {
        if (!this.leftChild(x)) this.leftChild(x, y, value);
        else this.rightChild(x, y, value);
    } else {
        if (dir === 0) this.leftChild(x, y, value);
        else this.rightChild(x, y, value);
    }
    return this;
};

export function BinaryTreeLayout(mode) {
    const biChildren = this._.biChildren;
    const roots = this.findNodes(node => this.father(node) === undefined);
    if (roots.length > 1) return;
    const root = roots[0];
    if (!root) return;
    let maxDepth = 0;
    const convertX = mode === "vertical" ? (rank, gap, depth) => this.x() + (rank * 2 + 1) * gap : (rank, gap, depth) => this.x() + this.layerWidth() * depth;
    const convertY = mode === "horizontal" ? (rank, gap, depth) => this.y() + (rank * 2 + 1) * gap : (rank, gap, depth) => this.y() + this.layerHeight() * depth;
    const convert = (rank, gap, depth) => [convertX(rank, gap, depth), convertY(rank, gap, depth)];
    const dfs = (current, rank, gap, depth) => {
        maxDepth = Math.max(maxDepth, depth);
        this.tryUpdate(current, () => {
            current.center(convert(rank, gap, depth));
        });
        if (biChildren[current.id][0]) dfs(this.element(biChildren[current.id][0]), rank * 2, gap / 2, depth + 1);
        if (biChildren[current.id][1]) dfs(this.element(biChildren[current.id][1]), rank * 2 + 1, gap / 2, depth + 1);
    };
    const gap = (mode === "vertical" ? this.width() : this.height()) / 2;
    dfs(root, 0, gap, 0);

    if (mode === "vertical") {
        this.vars.height = maxDepth * this.layerHeight();
    } else {
        this.vars.width = maxDepth * this.layerWidth();
    }

    this.forEachLink((link, sourceId, targetId) => {
        const source = this.findNodeById(sourceId);
        const target = this.findNodeById(targetId);
        this.tryUpdate(link, () => {
            link.source(source.center());
            link.target(target.center());
            trim(link, source, target);
        });
    });
}

/**
 * @param {"vertical"|"horizontal"} mode
 */
export function binaryTreeLayout(mode) {
    const sidToChildren = this._.sidToChildren;
    const root = this.root();
    if (!root) return this;
    let maxDepth = 0;
    const realX = mode === "vertical" ? (rank, gap, depth) => this.x() + (rank * 2 + 1) * gap : (rank, gap, depth) => this.x() + this.layerWidth() * depth;
    const realY = mode === "horizontal" ? (rank, gap, depth) => this.y() + (rank * 2 + 1) * gap : (rank, gap, depth) => this.y() + this.layerHeight() * depth;
    const dfs = (current, rank, gap, depth) => {
        maxDepth = Math.max(maxDepth, depth);
        const x = realX(rank, gap, depth);
        const y = realY(rank, gap, depth);
        this.tryMove(current, () => {
            current.cx(x);
            current.cy(y);
        });
        if (sidToChildren[current.id][0]) dfs(this.element(sidToChildren[current.id][0]), rank * 2, gap / 2, depth + 1);
        if (sidToChildren[current.id][1]) dfs(this.element(sidToChildren[current.id][1]), rank * 2 + 1, gap / 2, depth + 1);
    };
    const gap = (mode === "vertical" ? this.width() : this.height()) / 2;
    dfs(root, 0, gap, 0);

    const links = this.vars.links;
    for (let link of links) {
        const src = this.findNodeById(this.sourceId(link));
        const tgt = this.findNodeById(this.targetId(link));
        link.source(src.cx(), src.cy());
        link.target(tgt.cx(), tgt.cy());
        trim(link, src, tgt);
    }
    this.vars[mode === "vertical" ? "height" : "width"] = maxDepth * this[mode === "vertical" ? "layerHeight" : "layerWidth"];
}
