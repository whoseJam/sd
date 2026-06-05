import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 7;
const links = [
    [1, 2, 3],
    [1, 3, 5],
    [3, 4, 2],
    [3, 5, 4],
    [2, 6, 1],
    [1, 7, 1],
    [6, 8, 2],
    [4, 9, 1],
    [5, 10, 1],
    [7, 11, 1],
];
const keyNodes = [2, 4, 1, 7, 8];
const tree = new sd.Tree(svg);

sd.init(() => {
    links.forEach(([x, y, v]) => {
        tree.link(x, y);
    });
    keyNodes.forEach(node => {
        tree.element(node).strokeWidth(3).stroke(C.red);
    });
});

sd.main(async () => {});
