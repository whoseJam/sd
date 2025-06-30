import { Enter } from "@/Node/Core/Enter";
import { Tree } from "@/Node/Tree/Tree";
import { Cast } from "@/Utility/Cast";
import { trim } from "@/Utility/Trim";

export class BinaryTree extends Tree {
    constructor(target) {
        super(target);

        this.type("BinaryTree");

        this._.childrenMap = {}; 

        this.uneffect("tree");
        this.effect("tree", () => {
            BinaryTreeLayout.apply(this, ["vertical"]);
        });
    }
}

Object.assign(BinaryTree.prototype, {
    newNode(id, value) {
        const element = new this._.nodeType(this.layer("nodes")).opacity(0);
        this._.childrenMap[element.id] = [undefined, undefined];
        element.value(Cast.castToSDNode(element, value, id));
        element.onEnter(Enter.appear("nodes"));
        this.__insertNode(id, element);
        return this;
    },
    newLink(sourceId, targetId, type, value) {
        [sourceId, targetId] = [String(sourceId), String(targetId)];
        if (type === undefined) {
            if (!this._.childrenMap[this.element(sourceId).id][0]) {
                this._.childrenMap[this.element(sourceId).id][0] = targetId;
            } else {
                this._.childrenMap[this.element(sourceId).id][1] = targetId;
            }
        } else {
            this._.childrenMap[this.element(sourceId).id][type] = targetId;
        }
        const element = new this._.linkType(this.layer("links")).opacity(0);
        element.value(value);
        element.onEnter(Enter.appear("links"));
        this.__insertLink(sourceId, targetId, element);
        return this;
    },
    leftChild(sourceId, targetId, value = null) {
        if (arguments.length === 1) {
            const [node] = arguments;
            const _node = this.element(node);
            return this.findNodeById(this._.childrenMap[_node.id][0]);
        }
        if (!this.findNodeById(sourceId)) this.newNode(sourceId);
        if (!this.findNodeById(targetId)) this.newNode(targetId);
        this.newLink(sourceId, targetId, 0, value);
        return this;
    },
    rightChild(sourceId, targetId, value = null) {
        if (arguments.length === 1) {
            const [node] = arguments;
            const _node = this.element(node);
            return this.findNodeById(this._.childrenMap[_node.id][1]);
        }
        if (!this.findNodeById(sourceId)) this.newNode(sourceId);
        if (!this.findNodeById(targetId)) this.newNode(targetId);
        this.newLink(sourceId, targetId, 1, value);
        return this;
    },
    leftChildId(node) {
        return this.nodeId(this.leftChild(node));
    },
    rightChildId(node) {
        return this.nodeId(this.rightChild(node));
    },

    swapChildren(node) {
        const id = this.nodeId(node);
        const children = this._.childrenMap[this.element(id).id];
        [children[0], children[1]] = [children[1], children[0]];
        this.vars.nodes = this.vars.nodes;
        return this;
    },
    nodesOnPreorderTraversal(node) {
        const nodes = [];
        const traversal = node => {
            nodes.push(node);
            if (this.leftChild(node)) {
                console.log("left=", this.leftChild(node));
                traversal(this.leftChild(node));
            }
            if (this.rightChild(node)) {
                console.log("right=", this.rightChild(node));
                traversal(this.rightChild(node));
            }
        };
        if (arguments.length === 0) traversal(this.root());
        else traversal(this.element(node));
        return nodes;
    },
    nodesOnInorderTraversal(node) {
        const nodes = [];
        const traversal = node => {
            if (this.leftChild(node)) traversal(this.leftChild(node));
            nodes.push(node);
            if (this.rightChild(node)) traversal(this.rightChild(node));
        };
        if (arguments.length === 0) traversal(this.root());
        else traversal(this.element(node));
        return nodes;
    },
    nodesOnPostorderTraversal(node) {
        const nodes = [];
        const traversal = node => {
            if (this.leftChild(node)) traversal(this.leftChild(node));
            if (this.rightChild(node)) traversal(this.rightChild(node));
            nodes.push(node);
        };
        if (arguments.length === 0) traversal(this.root());
        else traversal(this.element(node));
        return nodes;
    },
    forEachNodeOnPreorderTraversal(node, callback) {
        if (arguments.length === 1) return this.forEachNodeOnPreorderTraversal(this.root(), arguments[0]);
        this.nodesOnPreorderTraversal(node).forEach(node => callback(node, this.nodeId(node)));
        return this;
    },
    forEachNodeOnInorderTraversal(node, callback) {
        if (arguments.length === 1) return this.forEachNodeOnInorderTraversal(this.root(), arguments[0]);
        this.nodesOnInorderTraversal(node).forEach(node => callback(node, this.nodeId(node)));
        return this;
    },
    forEachNodeOnPostorderTraversal(node, callback) {
        if (arguments.length === 1) return this.forEachNodeOnPostorderTraversal(this.root(), arguments[0]);
        this.nodesOnPostorderTraversal(node).forEach(node => callback(node, this.nodeId(node)));
        return this;
    },
});

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
    const childrenMap = this._.childrenMap;
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
        if (childrenMap[current.id][0]) dfs(this.element(childrenMap[current.id][0]), rank * 2, gap / 2, depth + 1);
        if (childrenMap[current.id][1]) dfs(this.element(childrenMap[current.id][1]), rank * 2 + 1, gap / 2, depth + 1);
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
