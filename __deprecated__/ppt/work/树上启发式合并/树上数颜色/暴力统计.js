import * as sd from "@/sd";
import { ColorCounter } from "./ColorCounter";

const svg = sd.svg();
const C = sd.color();
const colors = [C.green, C.blue, C.cyan, C.orange, C.purple];
const tree = new sd.Tree(svg);
const colArray = new ColorCounter(svg, colors);
const focus = sd.Focus(tree);
const colOfNode = sd.make1d(20);
const n = 12;
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 7],
    [5, 8],
    [6, 9],
    [7, 10],
    [7, 11],
    [8, 12],
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    for (let i = 1; i <= n; i++) {
        tree.color(i, colors[(colOfNode[i] = sd.rand(0, colors.length - 1))]);
    }
    tree.width(400).cx(600).y(100);
    colArray.x(tree.mx() + 50).y(tree.y());
});

async function dfs(u) {
    await sd.pause();
    focus.startAnimate().focus(u).endAnimate();
    await sd.pause();
    tree.startAnimate();
    tree.element(u).strokeWidth(3);
    tree.endAnimate();
    colArray.startAnimate().addColor(colOfNode[u]).endAnimate();
    const children = tree.children(u);
    for (let i = 0; i < children.length; i++) {
        const v = tree.nodeId(children[i]);
        await dfs(v);
    }
}

sd.main(async () => {
    await dfs(2);
});
