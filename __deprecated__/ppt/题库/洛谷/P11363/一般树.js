import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree1 = new sd.Tree(svg).width(300).layerHeight(80).dx(300);
const tree2 = new sd.Tree(svg).width(300).layerHeight(80);
const n = 10;
const links1 = [
    [1, 3],
    [1, 4],
    [4, 8],
    [4, 9],
    [4, 10],
];
const links2 = [
    [2, 5],
    [2, 6],
    [2, 7],
    [6, 11],
    [6, 12],
    [6, 13],
];
let rootLink;

sd.init(() => {
    tree1.root(1);
    tree2.root(2);
    links1.forEach(link => {
        tree1.link(link[0], link[1]);
        tree1.value(link[0], link[1], new sd.Rect(svg).width(20).height(20));
    });
    links2.forEach(link => {
        tree2.link(link[0], link[1]);
        tree2.value(link[0], link[1], new sd.Rect(svg).width(20).height(20));
    });
    rootLink = sd.Link(tree1.root(), tree2.root()).value(new sd.Rect(svg).width(20).height(20).color(C.orange));
});

sd.main(async () => {
    await sd.pause();
    tree1.forEachNode((node, i) => {
        const children = tree1.children(i);
        if (children.length === 0) return;
        if (tree1.father(node)) tree1.value(tree1.fatherId(node), i).startAnimate().strokeWidth(2).stroke(C.red).endAnimate();
    });
    tree2.forEachNode((node, i) => {
        const children = tree2.children(i);
        if (children.length === 0) return;
        if (tree2.father(node)) tree2.value(tree2.fatherId(node), i).startAnimate().strokeWidth(2).stroke(C.red).endAnimate();
    });
    rootLink.value().startAnimate().strokeWidth(2).stroke(C.red).endAnimate();
});
