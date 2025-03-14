import { effect, uneffect } from "@/Node/Core/Reactive";
import { BinaryTree } from "@/Node/Tree/BinaryTree";
import { trim } from "@/Utility/Trim";

export function Splay(parent) {
    BinaryTree.call(this, parent);

    this.type("Splay");

    uneffect(this._.updater);
    this._.updater = effect(() => {
        SplayLayout.call(this, "vertical");
    });
}

Splay.prototype = {
    ...BinaryTree.prototype,
};

function SplayLayout(mode) {
    const biChildren = this._.biChildren;
    const roots = this.findNodes(node => this.father(node) === undefined);
    if (roots.length > 1) return;
    const root = roots[0];
    if (!root) return;
    let maxDepth = 0;
    const convertX = mode === "vertical" ? (rank, gap, depth) => this.x() + (rank + 1) * gap : (rank, gap, depth) => this.x() + this.layerWidth() * depth;
    const convertY = mode === "horizontal" ? (rank, gap, depth) => this.y() + (rank + 1) * gap : (rank, gap, depth) => this.y() + this.layerHeight() * depth;
    const convert = (rank, gap, depth) => [convertX(rank, gap, depth), convertY(rank, gap, depth)];
    const sequence = [];
    const dfs = (current, depth) => {
        maxDepth = Math.max(maxDepth, depth);
        const lc = biChildren[this.element(current).id][0];
        const rc = biChildren[this.element(current).id][1];
        if (lc) dfs(this.element(lc), depth + 1);
        sequence.push([current, depth]);
        if (rc) dfs(this.element(rc), depth + 1);
    };
    dfs(root, 1);

    if (mode === "vertical") {
        this.vars.height = maxDepth * this.layerHeight();
    } else {
        this.vars.width = maxDepth * this.layerWidth();
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
