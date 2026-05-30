import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg);
const n = 7;
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [3, 6],
    [5, 7],
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    tree.cx(600).cy(300);
});

sd.main(async () => {
    await showAncestorAndLCA(4, 7);
    await showAncestorAndLCA(2, 6);
    await showAncestorAndLCA(2, 7);
});

async function showAncestorAndLCA(x, y) {
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        tree.element(i).fillOpacity(0);
        tree.element(i).fill(C.white);
        tree.element(i).mark = 0;
    }
    const px = sd.Pointer(tree, "x", "r", 3, 20).startAnimate().moveTo(x).endAnimate();
    const py = sd.Pointer(tree, "y", "l", 3, 20).startAnimate().moveTo(y).endAnimate();
    await climb(x);
    await climb(y);
    let lca = undefined;
    for (let i = 1; i <= n; i++) {
        const e = tree.element(i);
        if (e.mark === 2) {
            if (!lca || tree.depth(lca) < tree.depth(i)) lca = i;
        }
    }
    await sd.pause();
    tree.startAnimate().color(lca, C.green).endAnimate();
    await sd.pause();
    px.startAnimate().opacity(0).remove();
    py.startAnimate().opacity(0).remove();
    tree.startAnimate().color(C.white).endAnimate();
}

async function climb(x) {
    await sd.pause();
    tree.startAnimate();
    let cnt = 0;
    while (x && cnt <= 10) {
        tree.element(x).mark++;
        tree.element(x).fillOpacity(tree.element(x).fillOpacity() + 0.5);
        tree.element(x).color(C.red);
        x = tree.fatherId(x);
        if (!x) break;
        cnt++;
    }
    tree.endAnimate();
}
