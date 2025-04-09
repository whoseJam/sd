import { SD2DNode } from "@/Node/SD2DNode";
import { Check } from "@/Utility/Check";
import { ErrorLauncher } from "@/Utility/ErrorLauncher";
import { Factory } from "@/Utility/Factory";

function castToId(tree, object) {
    return Check.isTypeOfSDNode(object) ? tree.nodeId(object) : object;
}

export function BaseTree(parent) {
    SD2DNode.call(this, parent);

    this.vars.merge({
        x: 0,
        y: 0,
        links: [],
        nodes: [],
    });

    this._.sdnodesMap = {}; // SDNode id -> { node: SDNode, id: TreeID } | { link: SDNode, sourceId: TreeID, targetId: TreeID }
    this._.nodesMap = {}; // TreeID -> SDNode
    this._.linksMap = new Map(); // TreeID -> SDNode
}

BaseTree.prototype = {
    ...SD2DNode.prototype,
    BASE_TREE: true,
    x: Factory.handlerLowPrecise("x"),
    y: Factory.handlerLowPrecise("y"),
    rootId() {
        return this.nodeId(this.root());
    },
    nodeId(node) {
        if (node === undefined) return undefined;
        if (Check.isTypeOfSDNode(node)) {
            if (!this._.sdnodesMap[node.id]) return undefined;
            return this._.sdnodesMap[node.id].id;
        } else {
            if (!this._.nodesMap[String(node)]) return undefined;
            return String(node);
        }
    },
    nodesId() {
        return this.vars.nodes.map(node => this.nodeId(node));
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
    findNode(condition) {
        for (const node of this.vars.nodes) if (condition(node, this.nodeId(node))) return node;
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
        return this.findNode((_, id) => id === _id);
    },
    findLinkById(sourceId, targetId) {
        const [_sourceId, _targetId] = [String(sourceId), String(targetId)];
        return this.findLink((_, sourceId, targetId) => sourceId === _sourceId && targetId === _targetId);
    },
    inLink(node) {
        const id = this.nodeId(node);
        if (id === undefined) ErrorLauncher.nodeNotFound(node);
        return this.findLink((_1, _2, targetId) => targetId === id);
    },
    outLinks(node) {
        const id = this.nodeId(node);
        if (id === undefined) ErrorLauncher.nodeNotFound(node);
        return this.findLinks((_1, sourceId, _2) => sourceId === id);
    },
    father(node) {
        return this.source(this.inLink(node));
    },
    fatherId(node) {
        return this.sourceId(this.inLink(node));
    },
    ancestor(node, kth) {
        node = this.element(node);
        while (kth > 0 && node !== undefined) (node = this.father(node)), kth--;
        return node;
    },
    ancestorId(node, kth) {
        return this.nodeId(this.ancestor(node, kth));
    },
    depth(x) {
        if (arguments.length === 0) {
            const root = this.stratify();
            return root ? root.height : 0;
        } else {
            let depth = 1;
            while (this.father(x)) (x = this.father(x)), depth++;
            return depth;
        }
    },
    lca(x, y) {
        let [_x, _y, dx, dy] = [this.nodeId(x), this.nodeId(y), this.depth(x), this.depth(y)];
        if (_x === undefined) ErrorLauncher.nodeNotFound(x);
        if (_y === undefined) ErrorLauncher.nodeNotFound(y);
        for (let i = 1; i <= 100 && _x !== _y; i++) {
            if (dx > dy) (_x = this.fatherId(_x)), dx--;
            else (_y = this.fatherId(_y)), dy--;
        }
        if (_x !== _y) ErrorLauncher.lcaNotFound();
        return this.findNodeById(_x);
    },
    lcaId(x, y) {
        return this.nodeId(this.lca(x, y));
    },
    children(node) {
        return this.outLinks(node).map(link => this.target(link));
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
    cut(x, y) {
        this.__eraseLink(x, y);
        return this;
    },
    element() {
        if (arguments.length === 1) {
            const [node] = arguments;
            if (Check.isTypeOfSDNode(node)) return node;
            const [id] = arguments;
            return this.findNodeById(id);
        } else {
            const [source, target] = arguments;
            const [sourceId, targetId] = [castToId(this, source), castToId(this, target)];
            return this.findLinkById(sourceId, targetId);
        }
    },
    opacity() {
        if (arguments.length === 0) {
            return SD2DNode.prototype.opacity.call(this);
        } else if (arguments.length === 1) {
            if (Check.isTypeOfOpacity(arguments[0])) {
                const [opacity] = arguments;
                return SD2DNode.prototype.opacity.call(this, opacity);
            } else {
                const [node] = arguments;
                return this.nodeOpacity(node);
            }
        } else if (arguments.length === 2) {
            if (Check.isTypeOfOpacity(arguments[1])) {
                const [node, opacity] = arguments;
                return this.nodeOpacity(node, opacity);
            } else {
                const [source, target] = arguments;
                return this.linkOpacity(source, target);
            }
        } else {
            const [source, target, opacity] = arguments;
            return this.linkOpacity(source, target, opacity);
        }
    },
    nodeOpacity(node, opacity) {
        const element = this.__getNodeWithMethod(node, "opacity");
        if (arguments.length === 1) return element.opacity();
        element.opacity(opacity);
        return this;
    },
    linkOpacity(source, target, opacity) {
        const element = this.__getLinkWithMethod(source, target, "opacity");
        if (arguments.length === 2) return element.opacity();
        element.opacity(opacity);
        return this;
    },
    color() {
        if (arguments.length === 1) {
            if (Check.isTypeOfColor(arguments[0])) {
                const [color] = arguments;
                return this.forEachNode(node => node.color(color));
            } else {
                const [node] = arguments;
                const _node = this.__getNodeWithMethod(node, "color");
                return _node.color();
            }
        } else if (arguments.length === 2) {
            if (Check.isTypeOfColor(arguments[1])) {
                const [node, color] = arguments;
                const _node = this.__getNodeWithMethod(node, "color");
                _node.color(color);
                return this;
            } else {
                const [source, target] = arguments;
                const link = this.__getLinkWithMethod(source, target, "color");
                return link.color();
            }
        } else {
            const [source, target, color] = arguments;
            const link = this.__getLinkWithMethod(source, target, "color");
            link.color(color);
            return this;
        }
    },
    text() {
        if (arguments.length === 1) {
            const [node] = arguments;
            return this.nodeText(node);
        } else if (arguments.length === 2) {
            const [source, target] = arguments;
            if (this.element(source, target)) {
                return this.linkText(source, target);
            } else {
                const [node, text] = arguments;
                return this.nodeText(node, text);
            }
        } else {
            const [source, target, text] = arguments;
            return this.linkText(source, target, text);
        }
    },
    nodeText(node, text) {
        const element = this.__getNodeWithMethod(node, "text");
        if (arguments.length === 1) return element.text();
        element.text(text);
        return this;
    },
    linkText(source, target, text) {
        const element = this.__getLinkWithMethod(source, target, "text");
        if (arguments.length === 2) return element.text();
        element.text(text);
        return this;
    },
    intValue() {
        let element = undefined;
        if (arguments.length === 1) {
            const [node] = arguments;
            const _node = this.element(node);
            if (!_node) ErrorLauncher.nodeNotFound(node);
            element = _node;
        } else {
            const [source, target] = arguments;
            const link = this.element(source, target);
            if (!link) ErrorLauncher.linkNotFound(source, target);
            element = link;
        }
        if (!element.intValue) {
            if (!element.text) ErrorLauncher.methodNotFound(element, "intValue|text");
            const i = Math.floor(+element.text());
            if (isNaN(i)) ErrorLauncher.failToParseAsIntValue(element.text());
            return i;
        }
        return element.intValue();
    },
    value() {
        if (arguments.length === 1) {
            const [node] = arguments;
            return this.nodeValue(node);
        } else if (arguments.length === 2) {
            const [source, target] = arguments;
            if (this.element(source, target)) {
                return this.linkValue(source, target);
            } else {
                const [node, value] = arguments;
                return this.nodeValue(node, value);
            }
        } else if (arguments.length === 3) {
            const [source, target, value] = arguments;
            return this.linkValue(source, target, value);
        }
    },
    nodeValue(node, value) {
        const element = this.__getNodeWithMethod(node, "value");
        if (arguments.length === 1) return element.value();
        element.value(value);
        return this;
    },
    linkValue(source, target, value) {
        const element = this.__getLinkWithMethod(source, target, "value");
        if (arguments.length === 2) return element.value();
        element.value(value);
        return this;
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
        this._.linksMap.set([sourceId, targetId], element);
        this.childAs(element);
        this.vars.links.push(element);
        return this;
    },
    __eraseNode() {
        ErrorLauncher.notImplementedYet("__eraseNode", this.type());
    },
    __eraseLink(sourceId, targetId) {
        [sourceId, targetId] = [String(sourceId), String(targetId)];
        this._.linksMap.delete([sourceId, targetId]);
        const link = this.findLinkById(sourceId, targetId);
        this.eraseChild(link);
        this.vars.links.splice(this.vars.link.indexOf(link), 1);
        return this;
    },
    __getNodeWithMethod(node, method) {
        const element = this.element(node);
        if (!element) ErrorLauncher.nodeNotFound(node);
        if (typeof element[method] !== "function") ErrorLauncher.methodNotFound(element, method);
        return element;
    },
    __getLinkWithMethod(source, target, method) {
        const element = this.element(source, target);
        if (!element) ErrorLauncher.linkNotFound(source, target);
        if (typeof element[method] !== "function") ErrorLauncher.methodNotFound(element, method);
        return element;
    },
};
