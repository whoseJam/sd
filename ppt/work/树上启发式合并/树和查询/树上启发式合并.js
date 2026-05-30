import * as sd from "@/sd";
import { DSU } from "../_/DSU";
import { ColorExceedCounter } from "./ColorExceedCounter";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 12;
const colors = [C.green, C.blue, C.cyan];
const tree = new sd.Tree(svg);
const colArray = new ColorExceedCounter(svg, colors, n);
const focus = sd.Focus(tree);
const colOfNode = sd.make1d(20);
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
        tree.color(i, colors[(colOfNode[i] = sd.rand(0, 2))]);
    }
    tree.width(400).cx(600).y(100);
    colArray.cx(tree.cx()).y(tree.my() + 50);
});

async function onAddSubtree(subtree) {
    await sd.pause();
    tree.startAnimate();
    colArray.startAnimate();
    subtree.forEach(u => {
        colArray.addColor(colOfNode[u]);
        tree.element(u).strokeWidth(3);
    });
    tree.endAnimate();
    colArray.endAnimate();
}

async function onRemoveSubtree(subtree) {
    await sd.pause();
    tree.startAnimate();
    colArray.startAnimate();
    subtree.forEach(u => {
        colArray.removeColor(colOfNode[u]);
        tree.element(u).strokeWidth(1);
    });
    tree.endAnimate();
    colArray.endAnimate();
}

async function onAdd(u) {
    await sd.pause();
    tree.startAnimate();
    tree.element(u).strokeWidth(3);
    tree.endAnimate();
    colArray.startAnimate();
    colArray.addColor(colOfNode[u]);
    colArray.endAnimate();
}

async function onPrepareFor(u) {
    await sd.pause();
    focus.startAnimate().focus(u).endAnimate();
}

sd.main(async () => {
    await DSU(tree, {
        onAdd,
        onAddSubtree,
        onRemoveSubtree,
        onPrepareFor,
    });
});
