import * as sd from "@/sd";
import { DepthCounter } from "./DepthCounter";

const svg = sd.svg();
const tree = new sd.Tree(svg);
const focus = sd.Focus(tree);
const depArray = new DepthCounter(svg, 8);
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
    await dfs(2);
});

async function dfs(u) {
    await sd.pause();
    focus.startAnimate().focus(u).endAnimate();
    await sd.pause();
    tree.startAnimate();
    tree.element(u).strokeWidth(3).endAnimate();
    tree.endAnimate();
    depArray.startAnimate().addNode(tree.depth(u)).endAnimate();
    const children = tree.children(u);
    for (let i = 0; i < children.length; i++) {
        const v = tree.nodeId(children[i]);
        await dfs(v, u);
    }
}
