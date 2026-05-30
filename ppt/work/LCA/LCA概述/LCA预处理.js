import * as sd from "@/sd";
import { LCAPrepare } from "../_/LCAPrepare";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg).width(600).layerHeight(50);
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [3, 6],
    [5, 7],
    [7, 8],
    [7, 9],
    [9, 10],
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    tree.cx(600).cy(200);
});

sd.main(async () => {
    await LCAPrepare(tree, {
        onCreateTable,
        onStartFa,
        onFa,
        onEndFa,
    });
});

function onCreateTable(table) {
    table.cx(tree.cx()).y(tree.my() + 70);
    sd.Index(table, "t");
    sd.MathLabel(table, "fa[u][i]：表示 u 的第 2^i 级祖先", "bc", 25);
    global.table = table;
}

async function onStartFa(u) {
    global.links = [];
    await sd.pause();
    tree.startAnimate().color(u, C.blue).endAnimate();
}

async function onFa(u, fa, mid) {
    const nu = tree.element(u);
    const nfa = tree.element(fa);
    const link = new sd.Curve(svg).bending(-0.5);
    link.source(nu.center());
    link.target(nfa.center());
    sd.trim(link, nu, nfa);
    link.startAnimate().pointStoT().endAnimate().arrow();
    global.links.push(link);
}

async function onEndFa(u, fa) {
    await sd.pause();
    table.startAnimate();
    for (let i = 0; i < fa.length; i++) {
        if (fa[i]) {
            table.color(u, i, C.green);
            table.value(u, i, fa[i]);
        }
    }
    table.endAnimate();
    await sd.pause();
    tree.startAnimate().color(u, C.white).endAnimate();
    table.startAnimate().color(C.white).endAnimate();
    global.links.forEach(link => {
        link.startAnimate().opacity(0).endAnimate().remove();
    });
}
