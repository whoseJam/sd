import * as sd from "@/sd";

const svg = sd.svg();
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [3, 7],
    [3, 8],
    [1, 9],
    [9, 10],
];
const tree = new sd.Tree(svg).width(500);

sd.init(() => {
    links.forEach(([x, y]) => {
        tree.link(x, y);
    });
});

sd.main(async () => {});
