import { SDNode } from "@/Node/SDNode";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

function castToId(tree, object) {
    return Check.isTypeOfSDNode(object) ? tree.nodeId(object) : object;
}

export function BaseTree(parent) {
    SDNode.call(this, parent);

    this.vars.merge({
        x: 0,
        y: 0,
        links: [],
        nodes: [],
    });

    this._.sdnodesMap = {}; // SDNode id -> { node: SDNode, id: TreeID } | { link: SDNode, sourceId: TreeID, targetId: TreeID }
    this._.nodesMap = {}; // TreeID -> SDNode
    this._.linksMap = new Map(); // TreeID -> SDNode

    this._.BASE_TREE = true;
}

BaseTree.prototype = {
    ...SDNode.prototype,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    element() {
        const args = arguments;
        switch (args.length) {
            case 1:
                if (Check.isTypeOfSDNode(args[0])) return args[0];
                const node = this.findNodeById(args[0]);
                if (node) return node;
                ErrorLauncher.nodeNotExists(args[0]);
            case 2:
                const link = this.findLinkById(castToId(this, args[0]), castToId(this, args[1]));
                if (link) return link;
                ErrorLauncher.linkNotExist(castToId(this, args[0]), castToId(this, args[1]));
            default:
                ErrorLauncher.invalidArguments();
        }
    },
    value() {
        const args = arguments;
        switch (args.length) {
            case 1: {
                const node = this.element(args[0]);
                if (node) return node.value();
                ErrorLauncher.nodeNotExists(args[0]);
            }
            case 2: {
                const link = this.findLinkById(castToId(this, args[0]), castToId(this, args[1]));
                if (link) return link.value();
                const node = this.findNodeById(castToId(this, args[0]));
                if (node) return node.value(args[1]), this;
                ErrorLauncher.nodeNotExists(castToId(this, args[0]));
            }
            case 3: {
                const link = this.findLinkById(castToId(this, args[0]), castToId(this, args[1]));
                if (link) return link.value(args[2]), this;
                ErrorLauncher.linkNotExist(castToId(this, args[0]), castToId(this, args[1]));
            }
            default:
                ErrorLauncher.invalidArguments();
        }
    },
    opacity() {
        const args = arguments;
        switch (args.length) {
            case 0:
                return SDNode.prototype.opacity.call(this);
            case 1:
                if (Check.isTypeOfOpacity(args[0])) return SDNode.prototype.opacity.call(this, args[0]);
                return this.element(args[0]).opacity();
            case 2:
                if (Check.isTypeOfOpacity(args[1])) return this.element(args[0]).opacity(args[1]);
                return this.element(args[0], args[1]).opacity();
            case 3:
                return this.element(args[0], args[1]).opacity(args[2]), this;
            default:
                ErrorLauncher.invalidArguments();
        }
    },
    color() {
        const args = arguments;
        switch (args.length) {
            case 1: {
                const node = this.findNodeById(args[0]);
                if (node) return node.color();
                return this.forEachNode(node => node.color(args[0])), this;
            }
            case 2: {
                const node = this.findNodeById(args[0]);
                const link = this.findLinkById(args[0], args[1]);
                if (link) return link.color();
                if (Check.isTypeOfColor(args[1])) return node.color(args[1]), this;
                ErrorLauncher.invalidArguments();
            }
            case 3: {
                const link = this.findLinkById(args[0], args[1]);
                if (link) return link.color(args[2]);
                ErrorLauncher.linkNotExist(args[0], args[1]);
            }
            default:
                ErrorLauncher.invalidArguments();
        }
    },
    findNode(condition) {
        for (let node of this.vars.nodes) {
            if (condition(node, this.nodeId(node))) return node;
        }
        return undefined;
    },
    findNodes(condition) {
        const nodes = [];
        for (const node of this.vars.nodes) if (condition(node, this.nodeId(node))) nodes.push(node);
        return nodes;
    },
    findLink(condition) {
        for (const link of this.vars.links) if (condition(link, this.sourceId(link), this.targetId(link))) return link;
        return undefined;
    },
    findLinks(condition) {
        const links = [];
        for (const link of this.vars.links) if (condition(link, this.sourceId(link), this.targetId(link))) links.push(link);
        return links;
    },
    findNodeById(id) {
        const _id = String(id);
        return this.findNode((node, id) => id === _id);
    },
    findLinkById(sourceId, targetId) {
        const _sourceId = String(sourceId);
        const _targetId = String(targetId);
        return this.findLink((link, sourceId, targetId) => sourceId === _sourceId && targetId === _targetId);
    },
    inLink(node) {
        node = this.nodeId(node);
        return this.findLink((link, sourceId, targetId) => targetId === node);
    },
    outLinks(node) {
        node = this.nodeId(node);
        return this.findLinks((link, sourceId, targetId) => sourceId === node);
    },
    stratify() {
        const result = {};
        const root = this.root();
        if (!root) return undefined;
        const dfs = (current, depth) => {
            let height = depth;
            const children = [];
            this.children(current).forEach(child => {
                child.depth = current.depth + 1;
                height = Math.max(height, dfs(child, depth + 1));
                children.push(result[this.nodeId(child)]);
            });
            result[this.nodeId(current)] = {
                id: this.nodeId(current),
                children: children,
                depth: depth,
                height: height,
                data: current,
            };
            return height;
        };
        dfs(root, 1);
        return result[this.nodeId(root)];
    },
    father(node) {
        return this.source(this.inLink(node));
    },
    fatherId(node) {
        return this.sourceId(this.inLink(node));
    },
    ancestor(node, kth) {
        node = this.element(node);
        for (let i = 1; i <= kth; i++) {
            node = this.father(node);
        }
        return node;
    },
    ancestorId(node, kth) {
        return this.nodeId(this.ancestor(node, kth));
    },
    depth(u) {
        if (u === undefined) {
            const root = this.stratify();
            return root ? root.height : 0;
        }
        let depth = 1;
        while (this.father(u)) {
            u = this.father(u);
            depth++;
        }
        return depth;
    },
    lca(x, y) {
        x = this.nodeId(x);
        y = this.nodeId(y);
        let dx = this.depth(x);
        let dy = this.depth(y);
        for (let i = 1; i <= 100 && x !== y; i++) {
            if (dx > dy) {
                x = this.fatherId(x);
                dx--;
            } else {
                y = this.fatherId(y);
                dy--;
            }
        }
        return this.findNodeById(x);
    },
    lcaId(x, y) {
        return this.nodeId(this.lca(x, y));
    },
    children(node) {
        return this.outLinks(node).map(link => this.target(link));
    },
    newNodeByBaseTree(id, element) {
        id = String(id);
        this._.sdnodesMap[element.id] = { node: element, id };
        this._.nodesMap[id] = element;
        this.childAs(element);
        this.vars.nodes.push(element);
        return this;
    },
    newLinkByBaseTree(sourceId, targetId, element) {
        [sourceId, targetId] = [String(sourceId), String(targetId)];
        this._.sdnodesMap[element.id] = { link: element, sourceId, targetId };
        this._.linksMap.set([sourceId, targetId], element);
        this.childAs(element);
        this.vars.links.push(element);
        return this;
    },
    eraseLinkByBaseTree(sourceId, targetId) {
        [sourceId, targetId] = [String(sourceId), String(targetId)];
        this._.linksMap.delete([sourceId, targetId]);
        const link = this.findLinkById(sourceId, targetId);
        this.eraseChild(link);
        this.vars.links.splice(this.vars.link.indexOf(link), 1);
        return this;
    },
    root(id, value) {
        if (id === undefined) return this.findNode(node => this.father(node) === undefined);
        this.newNode(id, value);
        return this;
    },
    link(sourceId, targetId, value) {
        if (!this.findNodeById(targetId)) this.newNode(targetId);
        if (!this.findNodeById(sourceId)) this.newNode(sourceId);
        this.newLink(sourceId, targetId, value);
        return this;
    },
    cut(x, y) {
        this.eraseLinkByBaseTree(x, y);
        return this;
    },
    text() {
        const value = this.element.apply(this, arguments).value();
        if (value === undefined) return "";
        if (!value.text) ErrorLauncher.invalidInvoke("text");
        return value.text();
    },
    intValue() {
        const value = this.element.apply(this, arguments).value();
        if (!value) return 0;
        if (!value.text) ErrorLauncher.invalidInvoke("intValue");
        return +value.text();
    },
    nodesInSubtree(node) {
        node = this.element(node);
        const nodeList = [];
        const dfs = node => {
            nodeList.push(node);
            const children = this.children(node);
            children.forEach(child => {
                dfs(child);
            });
        };
        dfs(node);
        return nodeList;
    },
    linksInSubtree(node) {
        node = this.element(node);
        const linkList = [];
        const dfs = node => {
            const children = this.children(node);
            children.forEach(child => {
                linkList.push(this.element(node, child));
                dfs(child);
            });
        };
        dfs(node);
        return linkList;
    },
    forEachNodeInSubtree(node, callback) {
        this.nodesInSubtree(node).forEach(node => {
            callback(node, this.nodeId(node));
        });
    },
    forEachLinkInSubtree(node, callback) {
        this.linksInSubtree(node).forEach(link => {
            callback(link, this.sourceId(link), this.targetId(link));
        });
    },
    nodesOnPath(source, target) {
        source = this.element(source);
        const sourceList = [];
        target = this.element(target);
        const targetList = [];
        let sourceDepth = this.depth(source);
        let targetDepth = this.depth(target);
        for (let i = 1; i <= 100 && source !== target; i++) {
            if (sourceDepth > targetDepth) {
                sourceList.push(source);
                source = this.father(source);
                sourceDepth--;
            } else {
                targetList.push(target);
                target = this.father(target);
                targetDepth--;
            }
        }
        return [...sourceList, source, ...targetList.reverse()];
    },
    linksOnPath(source, target) {
        source = this.element(source);
        const sourceList = [];
        target = this.element(target);
        const targetList = [];
        let sourceDepth = this.depth(source);
        let targetDepth = this.depth(target);
        for (let i = 1; i <= 100 && source !== target; i++) {
            if (sourceDepth > targetDepth) {
                sourceList.push(this.element(this.father(source), source));
                source = this.father(source);
                sourceDepth--;
            } else {
                targetList.push(this.element(this.father(target), target));
                target = this.father(target);
                targetDepth--;
            }
        }
        return [...sourceList, ...targetList.reverse()];
    },
    forEachNodeOnPath(source, target, callback) {
        this.nodesOnPath(source, target).forEach(node => callback(node, this.nodeId(node)));
        return this;
    },
    forEachLinkOnPath(source, target, callback) {
        this.linksOnPath(source, target).forEach(link => callback(link, this.sourceId(link), this.targetId(link)));
        return this;
    },
    forEachNode(callback) {
        this.vars.nodes.forEach(node => callback(node, this.nodeId(node)));
        return this;
    },
    forEachLink(callback) {
        this.vars.links.forEach(link => callback(link, this.sourceId(link), this.targetId(link)));
        return this;
    },
    rootId() {
        return this.nodeId(this.root());
    },
    nodeId(node) {
        if (node === undefined) return undefined;
        if (Check.isTypeOfSDNode(node)) {
            if (!this._.sdnodesMap[node.id]) return undefined;
            return this._.sdnodesMap[node.id].id;
        }
        return String(node);
    },
    nodesId() {
        return this.nodes().map(node => this.nodeId(node));
    },
    sourceId(link) {
        return this.nodeId(this.source(link));
    },
    targetId(link) {
        return this.nodeId(this.target(link));
    },
    source(link) {
        if (link === undefined) return undefined;
        if (!this._.sdnodesMap[link.id]) return undefined;
        return this.element(this._.sdnodesMap[link.id].sourceId);
    },
    target(link) {
        if (link === undefined) return undefined;
        if (!this._.sdnodesMap[link.id]) return undefined;
        return this.element(this._.sdnodesMap[link.id].targetId);
    },
    nodes() {
        return [...this.vars.nodes];
    },
    links() {
        return [...this.vars.links];
    },
};
