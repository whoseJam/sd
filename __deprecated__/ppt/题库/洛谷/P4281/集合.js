import * as sd from "@/sd";

const svg = sd.svg();
const tree = new sd.Tree(svg);
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [4, 5],
    [4, 6],
    [4, 7],
    [5, 8],
    [6, 9],
    [6, 10],
];

sd.init(() => {
    links.forEach(link => tree.link(link[0], link[1]));
});

sd.main(async () => {
    await sd.pause();
});
