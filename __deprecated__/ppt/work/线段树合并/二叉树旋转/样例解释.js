import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();
const R = sd.rule();
const tree = new sd.BinaryTree(svg).x(100).width(400).layerHeight(80);
const arr = new sd.Array(svg);
const n = 4;
const permutation = [0, 0, 0, 4, 2, 1, 3];
const links = [
    [1, 2],
    [1, 3],
    [3, 4],
    [3, 5],
    [2, 6],
    [2, 7],
];

sd.init(() => {
    permutation.forEach((p, id) => {
        tree.newNode(id + 1, p);
    });
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    tree.forEachNode(node => {
        const u = tree.nodeId(node);
        node.onClick(() => {
            const lc = tree.leftChildId(node);
            const rc = tree.rightChildId(node);
            if (!lc || !rc) return;
            sd.inter(async () => {
                tree.startAnimate().swapChildren(u).endAnimate();
            });
        });
    });
});

sd.main(async () => {
    await sd.pause();
    tree.forEachNode(node => node.onClick(null));
    arr.x(tree.cx() - (arr.elementWidth() * n) / 2).y(tree.my() + 40);
    tree.forEachNodeOnPreorderTraversal(node => {
        const i = node.intValue();
        if (i) arr.startAnimate().push(i).endAnimate();
    });
    await sd.pause();
    for (let i = 0; i < arr.length(); i++) for (let j = i + 1; j < arr.length(); j++) if (arr.intValue(i) > arr.intValue(j)) sd.Link(arr.element(i), arr.element(j), sd.Curve, "cx", "my", "cx", "my").bending(0.3).startAnimate().pointStoT().endAnimate();
});
