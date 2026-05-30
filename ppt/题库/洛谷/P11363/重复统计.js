import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree1 = new sd.Tree(svg).width(300).layerHeight(80);
const tree2 = new sd.Tree(svg).width(300).layerHeight(80).dx(300);
const n = 5;
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5]
];
const path = [
    [[1, 2], [1, 3], sd.CircleCurve, (line) => line.r(50)],
    [[1, 2], [2, 4], sd.Curve, (line) => line.bending(0.5)],
    [[2, 4], [2, 5], sd.Line]
];

sd.init(() => {
    tree1.root(1);
    tree2.root(1);
    links.forEach(link => {
        tree1.link(link[0], link[1]);
        tree1.value(link[0], link[1], new sd.Rect(svg).width(20).height(20));
        tree2.link(link[0], link[1]);
        tree2.value(link[0], link[1], new sd.Rect(svg).width(20).height(20));
    });
    tree1.value(1, 2).color(C.orange);
    tree2.value(1, 3).color(C.orange);
    path.forEach(p => {
        const l1 = sd.Link(tree1.value(p[0][0], p[0][1]), tree1.value(p[1][0], p[1][1]), p[2]).stroke(C.darkGrey).strokeDashArray([5, 5]);
        const l2 = sd.Link(tree2.value(p[0][0], p[0][1]), tree2.value(p[1][0], p[1][1]), p[2]).stroke(C.darkGrey).strokeDashArray([5, 5]);
        if (p[3]) { p[3](l1); p[3](l2); }
    });
})

sd.main(async () => {
    
})