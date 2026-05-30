import * as sd from "@/sd";

export class TreeGraph extends sd.SD2DNode {
    constructor(target, n, links_, extraLinks) {
        super(target);

        const tree = new sd.Tree(this);
        const links = [];

        this.vars.merge({
            tree,
            x: 0,
            y: 0,
            width: 500,
            links,
        });

        this.effect("layout", () => {
            this.vars.tree.width(this.width());
        });

        for (let i = 1; i <= n; i++) tree.newNode(i);
        links_.forEach(([x, y]) => {
            tree.newLink(x, y);
            tree.element(x, y);
        });

        extraLinks.forEach(link => {
            const [x, y, clazz] = [link[0], link[1], link[2]];
            links.push({
                link: sd.Link(tree.element(x), tree.element(y), clazz),
                x: String(x),
                y: String(y),
            });
        });

        this.childAs(tree);
    }
    element(x, y) {
        x = String(x);
        y = String(y);
        if (arguments.length === 1) {
            return this.vars.tree.element(x);
        } else {
            const links = this.vars.links;
            for (let i = 0; i < links.length; i++) {
                if (links[i].x === x && links[i].y === y) {
                    return links[i];
                }
            }
            return this.vars.tree.element(x, y);
        }
    }
    color(x, color) {
        return this.vars.tree.color(x, color);
    }
    sourceId(link) {
        const tree = this.vars.tree;
        const links = this.vars.links;
        for (let i = 0; i < links.length; i++) {
            if (links[i].link === link) {
                return links[i].x;
            }
        }
        return tree.sourceId(link);
    }
    targetId(link) {
        const tree = this.vars.tree;
        const links = this.vars.links;
        for (let i = 0; i < links.length; i++) {
            if (links[i].link === link) {
                return links[i].y;
            }
        }
        return tree.targetId(link);
    }
    outLinksAndNodes(u) {
        u = String(u);
        const tree = this.vars.tree;
        const links = [];
        const nodes = [];
        tree.children(u).forEach(node => {
            nodes.push(node);
            links.push(tree.element(u, node));
        });
        if (tree.father(u)) {
            nodes.push(tree.father(u));
            links.push(tree.inLink(u));
        }
        const links_ = this.vars.links;
        links_.forEach(link => {
            if (link.x === u) {
                nodes.push(tree.element(link.y));
                links.push(link.link);
            }
            if (link.y === u) {
                nodes.push(tree.element(link.x));
                links.push(link.link);
            }
        });
        return [links, nodes];
    }
    nodes() {
        return this.vars.tree.nodes();
    }
    nodeId(u) {
        return this.vars.tree.nodeId(u);
    }
    x(x) {
        if (arguments.length === 0) return this.vars.x;
        this.vars.lpset("x", x);
        return this;
    }
    y(y) {
        if (arguments.length === 0) return this.vars.y;
        this.vars.lpset("y", y);
        return this;
    }
    width(width) {
        if (arguments.length === 0) return this.vars.width;
        this.vars.lpset("width", width);
        return this;
    }
    height(height) {
        if (arguments.length === 0) return this.vars.tree.height();
        this.vars.tree.height(height);
        return this;
    }
}
