import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 6;
const links = [
    [1, 2],
    [2, 5],
    [2, 6],
    [6, 3],
    [6, 4],
];
const tree = new sd.Tree(svg).layerHeight(90).width(600);
const lcaGrid = new sd.Grid(svg).x(tree.mx()).dy(-20).n(n).m(n).startN(1).startM(1);

function LCA(l, r) {
    let lca = l;
    for (let i = l + 1; i <= r; i++) lca = tree.nodeId(tree.lca(lca, i));
    return lca;
}

sd.init(() => {
    sd.Index(lcaGrid, "t");
    sd.Index(lcaGrid, "l");
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    lcaGrid.cy(tree.cy());
    for (let i = 1; i <= n; i++) for (let j = i; j <= n; j++) lcaGrid.value(i, j, LCA(i, j));
});

sd.main(async () => {});
