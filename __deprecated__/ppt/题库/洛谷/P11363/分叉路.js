import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg).width(300).layerHeight(80);
const n = 4;
const links = [
    [1, 2],
    [2, 3],
    [2, 4],
];
const path = [
    [[1, 2], [2, 3], sd.Curve, line => line.bending(0.5)],
    [[1, 2], [2, 4], sd.Curve, line => line.bending(-0.5)],
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
        tree.value(link[0], link[1], new sd.Rect(svg).width(20).height(20).color(C.orange));
    });
    path.forEach(p => {
        const l = sd.Link(tree.value(p[0][0], p[0][1]), tree.value(p[1][0], p[1][1]), p[2]).stroke(C.darkGrey).strokeDashArray([5, 5]);
        if (p[3]) p[3](l);
    });
});

sd.main(async () => {});
