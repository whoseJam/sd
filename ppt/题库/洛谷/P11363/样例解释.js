import * as sd from "@/sd";

const svg = sd.svg();
const tree = new sd.Tree(svg).width(600).layerHeight(80);
const n = 15;
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [3, 6],
    [3, 7],
    [3, 8],
    [4, 9],
    [4, 10],
    [5, 11],
    [6, 12],
    [7, 13],
    [8, 14],
    [8, 15]
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
})

sd.main(async () => {
    await sd.pause();
    tree.startAnimate();
    links.forEach(link => {
        tree.value(link[0], link[1], new sd.Rect(svg).width(20).height(20));
    });
    tree.endAnimate();
})