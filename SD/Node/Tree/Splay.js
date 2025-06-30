import { BinaryTree } from "@/Node/Tree/BinaryTree";
import { trim } from "@/Utility/Trim";

export class Splay extends BinaryTree {
    constructor(target) {
        super(target);

        this.type("Splay");

        this.uneffect("tree");
        this.effect("tree", () => {
            SplayLayout.call(this, "vertical");
        });
    }
}

function SplayLayout(mode) {
    const childrenMap = this._.childrenMap;
    const roots = this.findNodes(node => this.father(node) === undefined);
    if (roots.length > 1) return;
    const root = roots[0];
    if (!root) return;
    let maxDepth = 0;
    const convertX = mode === "vertical" ? (rank, gap, depth) => this.x() + (rank + 1) * gap : (rank, gap, depth) => this.x() + this.layerWidth() * (depth - 1);
    const convertY = mode === "horizontal" ? (rank, gap, depth) => this.y() + (rank + 1) * gap : (rank, gap, depth) => this.y() + this.layerHeight() * (depth - 1);
    const convert = (rank, gap, depth) => [convertX(rank, gap, depth), convertY(rank, gap, depth)];
    const sequence = [];
    const dfs = (current, depth) => {
        maxDepth = Math.max(maxDepth, depth);
        const lc = childrenMap[this.element(current).id][0];
        const rc = childrenMap[this.element(current).id][1];
        if (lc) dfs(this.element(lc), depth + 1);
        sequence.push([current, depth]);
        if (rc) dfs(this.element(rc), depth + 1);
    };
    dfs(root, 1);

    if (mode === "vertical") {
        this.vars.height = (maxDepth - 1) * this.layerHeight();
    } else {
        this.vars.width = (maxDepth - 1) * this.layerWidth();
    }

    const gap = (mode === "vertical" ? this.width() : this.height()) / (sequence.length + 1);
    for (let [idx, info] of sequence.entries()) {
        const node = info[0];
        this.tryUpdate(node, () => {
            node.center(convert(idx, gap, info[1]));
        });
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
