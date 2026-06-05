import * as sd from "@/sd";
import { DSU } from "../_/DSU";
import { DepthCounter } from "./DepthCounter";

const svg = sd.svg();
const tree = new sd.Tree(svg);
const focus = sd.Focus(tree);
const depArray = new DepthCounter(svg, 8);
const dep = sd.make1d(20);
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
    tree.width(400).cx(600).y(100);
    depArray.x(tree.mx() + 50).y(tree.y());
});

sd.main(async () => {
    await DSU(tree, {
        onAdd,
        onAddSubtree,
        onRemoveSubtree,
        onPrepareFor,
    });
});

async function onAddSubtree(subtree) {
    await sd.pause();
    tree.startAnimate();
    depArray.startAnimate();
    subtree.forEach(u => {
        depArray.addNode(tree.depth(u));
        tree.element(u).strokeWidth(3);
    });
    tree.endAnimate();
    depArray.endAnimate();
}

async function onRemoveSubtree(subtree) {
    await sd.pause();
    tree.startAnimate();
    depArray.startAnimate();
    subtree.forEach(u => {
        depArray.removeNode(tree.depth(u));
        tree.element(u).strokeWidth(1);
    });
    tree.endAnimate();
    depArray.endAnimate();
}

async function onAdd(u) {
    await sd.pause();
    tree.startAnimate();
    tree.element(u).strokeWidth(3);
    tree.endAnimate();
    depArray.startAnimate();
    depArray.addNode(tree.depth(u));
    depArray.endAnimate();
}

async function onPrepareFor(u) {
    await sd.pause();
    focus.startAnimate().focus(u).endAnimate();
}
