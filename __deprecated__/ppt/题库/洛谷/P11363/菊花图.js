import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg).width(600).layerHeight(80);
const n = 7;
const links = [
    [1, 2],
    [1, 3],
    [1, 4],
    [1, 5],
    [1, 6],
    [1, 7],
];

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
        tree.value(link[0], link[1], new sd.Rect(svg).width(20).height(20));
    });
    tree.value(1, 2).color(C.orange);
})

sd.main(async () => {
    
})