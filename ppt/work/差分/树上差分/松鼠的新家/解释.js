import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg);
const n = 9;
const nodes = [9, 2, 8];
const links = [
    [1, 2],
    [2, 3],
    [3, 4],
    [3, 5],
    [1, 6],
    [6, 7],
    [6, 8],
    [1, 9],
];

sd.init(() => {
    for (let i = 1; i <= n; i++) tree.newNode(i, "0");
    links.forEach(([x, y]) => {
        tree.link(x, y);
    });
});

sd.main(async () => {
    for (let i = 1; i < nodes.length; i++) {
        await sd.pause();
        const a = nodes[i - 1];
        const b = nodes[i];
        sd.Link(tree.element(a), tree.element(b), sd.Curve).color(C.red).startAnimate().pointStoT().endAnimate().arrow();
        await sd.pause();
        tree.forEachNodeOnPath(a, b, node => {
            node.startAnimate()
                .text(node.intValue() + 1)
                .endAnimate();
        });
    }
});
