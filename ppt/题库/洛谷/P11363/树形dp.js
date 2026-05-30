import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
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
const colorful = [
    [1, 2],
    [3, 7],
    [3, 8],
    [4, 10]
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
        tree.value(link[0], link[1], new sd.Rect(svg).width(20).height(20));
    });
    colorful.forEach(link => {
        tree.value(link[0], link[1]).color(C.orange);
    });
})

sd.main(async () => {
    
})