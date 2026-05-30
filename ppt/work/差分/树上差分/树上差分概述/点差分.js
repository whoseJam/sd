import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg).width(600);
const n = 12;
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [4, 6],
    [4, 7],
    [6, 8],
    [6, 9],
    [7, 10],
    [9, 11],
    [10, 12],
];

sd.init(() => {
    tree.freeze();
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    for (let i = 1; i <= n; i++) {
        const node = tree.element(i);
        node.childAs("token", new sd.Stack(node).elementWidth(10).elementHeight(10), R.aside("lt"));
    }
    tree.cx(600).cy(300);
    tree.unfreeze();
});

sd.main(async () => {
    await addNodeValueOnPath(9, 10);
});

async function addNodeValueOnPath(u, v) {
    const dg = tree.lca(u, v);
    const g = tree.nodeId(dg);
    const fg = tree.fatherId(dg);

    await sd.pause();
    sd.Label(tree.element(u), "+1", "rc", 20, 3).opacity(0).startAnimate().opacity(1).endAnimate();
    tree.startAnimate().color(u, C.blue).endAnimate();
    await addCurrentToRoot(u);
    await sd.pause();
    sd.Label(tree.element(v), "+1", "rc", 20, 3).opacity(0).startAnimate().opacity(1).endAnimate();
    tree.startAnimate().color(v, C.blue).endAnimate();
    await addCurrentToRoot(v);
    await sd.pause();
    sd.Label(tree.element(g), "-1", "rc", 20, 3).opacity(0).startAnimate().opacity(1).endAnimate();
    tree.startAnimate().color(g, C.red).endAnimate();
    await addCurrentToRoot(g, "pop");
    if (fg) {
        await sd.pause();
        sd.Label(tree.element(fg), "-1", "rc", 20, 3).opacity(0).startAnimate().opacity(1).endAnimate();
        tree.startAnimate().color(fg, C.red).endAnimate();
        await addCurrentToRoot(fg, "pop");
    }
}

async function addCurrentToRoot(u, type = "push") {
    await sd.pause();
    while (u) {
        const du = tree.element(u);
        tree.startAnimate();
        if (type === "push") du.child("token").push().color(C.BLUE);
        else du.child("token").pop();
        tree.endAnimate();
        u = tree.fatherId(du);
    }
}
