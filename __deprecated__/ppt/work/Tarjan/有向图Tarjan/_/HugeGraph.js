import * as sd from "@/sd";
import { MetaGraph } from "./MetaGraph";

const DEFAULT_GRAPHS = {
    1: {
        n: 4,
        x: 0,
        y: 0,
        links: [
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 1],
            [1, 3],
        ],
    },
    2: {
        n: 3,
        x: 1,
        y: 0,
        links: [
            [1, 2],
            [2, 3],
            [3, 1],
        ],
    },
    3: {
        n: 1,
        x: 0.5,
        y: 0.5,
        links: [],
    },
    4: {
        n: 3,
        x: 0,
        y: 1,
        links: [
            [1, 2],
            [2, 3],
            [3, 1],
        ],
    },
    5: {
        n: 4,
        x: 1,
        y: 1,
        links: [
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 1],
            [2, 4],
        ],
    },
};

const DEFAULT_EXTERN_LINKS = [
    [[1, 3], [3, 1], sd.Line, {}],
    [[1, 3], [2, 1], sd.Curve, {}],
    [[3, 1], [4, 2], sd.Line, {}],
    [[3, 1], [5, 2], sd.Curve, {}],
    [[1, 4], [4, 1], sd.Line, {}],
    [[4, 3], [5, 4], sd.Line, {}],
];

export class HugeGraph extends sd.ValueGridGraph {
    constructor(target, graphs, externLinks) {
        super(target);
        this.width(250).height(200);
        this._.graphs = {};
        this._.links = [];
        graphs = graphs || DEFAULT_GRAPHS;
        externLinks = externLinks || DEFAULT_EXTERN_LINKS;
        for (const id in graphs) {
            this._.graphs[id] = new MetaGraph(this, graphs[id].n, graphs[id].links);
            this.at(graphs[id].x, graphs[id].y).newNode(id, this._.graphs[id]);
        }
        for (const link of externLinks) {
            const [g1, x1] = link[0];
            const [g2, x2] = link[1];
            const [e1, e2] = [this.element(g1).element(x1), this.element(g2).element(x2)];
            const line = sd.Link(e1, e2, link[2]).arrow();
            line._.g1 = g1;
            line._.x1 = x1;
            line._.g2 = g2;
            line._.x2 = x2;
            this._.links.push(line);
        }
    }
    node(i, j) {
        if (arguments.length === 1) return this.element(i);
        return this.element(i).element(j);
    }
    externLinks() {
        return this._.links;
    }
    forEachExternLink(callback) {
        this._.links.forEach(link => {
            callback(link, link._.g1, link._.x1, link._.g2, link._.x2);
        });
    }
    outLinksAndNodes(u) {
        const nodes = [];
        const links = [];
        const ids = [];
        const [g, x] = u;
        const subgraph = this.node(g);
        subgraph.outLinks(x, "direct").forEach(link => {
            nodes.push(subgraph.target(link));
            links.push(link);
            ids.push([g, subgraph.targetId(link)]);
        });
        this.forEachExternLink((link, g1, x1, g2, x2) => {
            if (String(g1) === String(g) && String(x1) === String(x)) {
                nodes.push(this.node(g2, x2));
                links.push(link);
                ids.push([g2, x2]);
            }
        });
        return [links, nodes, ids];
    }
}
