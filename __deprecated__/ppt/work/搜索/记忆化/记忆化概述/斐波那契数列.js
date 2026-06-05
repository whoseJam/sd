import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree1 = new sd.BoxTree(svg).width(500).elementWidth(60).elementHeight(30);
const tree2 = new sd.BoxTree(svg).width(500).elementWidth(60).elementHeight(30).dx(400);
const memory = sd.make1d(10);
let tot;

sd.init(() => {
    tot = 0;
    f(5);
    tot = 0;
    ff(5);
    tree1.forEachLink(link => link.opacity(0));
    tree1.forEachNode(node => node.opacity(0));
    tree1.nodeOpacity(1, 1);
    tree2.forEachLink(link => link.opacity(0));
    tree2.forEachNode(node => node.opacity(0));
    tree2.nodeOpacity(1, 1);
});

sd.main(async () => {
    await dfs(tree1, 1);
    await dfs(tree2, 1);
});

function f(x) {
    const current = ++tot;
    tree1.newNode(current, `f(${x})`);
    if (x <= 2) return current;
    const lc = f(x - 1);
    const rc = f(x - 2);
    tree1.link(current, lc).link(current, rc);
    return current;
}

function ff(x) {
    const current = ++tot;
    tree2.newNode(current, `f(${x})`);
    if (x <= 2 || memory[x]) return current;
    const lc = ff(x - 1);
    const rc = ff(x - 2);
    tree2.link(current, lc).link(current, rc);
    memory[x] = true;
    return current;
}

async function dfs(tree, u) {
    const children = tree.children(u);
    if (children.length > 0) {
        await sd.pause();
        for (const child of children) {
            child.startAnimate().opacity(1).endAnimate();
            const link = tree.element(u, child);
            link.opacity(1).startAnimate().pointStoT().endAnimate().arrow();
        }
    }
    for (const child of children) {
        await dfs(tree, tree.nodeId(child));
    }
}
