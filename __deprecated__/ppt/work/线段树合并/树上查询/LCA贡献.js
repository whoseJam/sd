import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 6;
const links = [
    [1, 6],
    [6, 5],
    [6, 2],
    [2, 3],
    [2, 4],
];
const tree = new sd.Tree(svg).width(500);
const lcaGrid = new sd.Grid(svg).x(tree.mx()).dy(-20).n(n).m(n).startN(1).startM(1);
const lcaData = sd.make2d(20, 20);
const lcaFocus = sd.Focus(tree);

sd.init(() => {
    sd.Index(lcaGrid, "t");
    sd.Index(lcaGrid, "l");
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
});

sd.main(async () => {
    for (let l = 1; l <= n; l++) {
        for (let r = l; r <= n; r++) {
            await sd.pause();
            await LCA(l, r);
        }
    }
});

async function LCA(l, r) {
    const text = new sd.Text(svg, `[${l},${r}]`);
    text.cx(tree.cx()).y(tree.my() + 20);
    text.opacity(0).startAnimate().opacity(1).endAnimate();

    tree.startAnimate();
    for (let i = l; i <= r; i++) tree.color(i, C.blue);
    tree.endAnimate();

    await sd.pause();
    let lca = l;
    for (let i = l + 1; i <= r; i++) {
        lca = tree.nodeId(tree.lca(lca, i));
    }
    lcaFocus.startAnimate().focus(lca).endAnimate();
    lcaData[l][r] = lca;
    await sd.pause();
    lcaGrid.startAnimate().value(l, r, lca).endAnimate();

    await sd.pause();
    lcaFocus.startAnimate().focus(null).endAnimate();
    text.startAnimate().opacity(0).endAnimate().remove();
    tree.startAnimate().color(C.white).endAnimate();
}
