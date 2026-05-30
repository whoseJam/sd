import * as sd from "@/sd";

const svg = sd.svg();
const tree = new sd.Tree(svg);
const links = [
    [1, 2],
    [1, 3],
    [3, 4],
    [3, 5],
];

sd.init(() => {
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
});

sd.main(async () => {});
