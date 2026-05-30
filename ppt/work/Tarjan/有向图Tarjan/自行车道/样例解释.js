import * as sd from "@/sd";

const svg = sd.svg();
const n = 6;
const links = [
    [1, 2],
    [2, 3],
    [3, 5],
    [2, 4],
    [4, 1],
    [2, 6],
    [6, 5],
];
const graph = new sd.GridGraph(svg).width(400).height(120);
const nodes = [
    [1, 0, 0],
    [2, 0, 0.33],
    [3, 0, 0.66],
    [5, 0, 1],
    [4, 1, 0.33],
    [6, 1, 0.66],
];

sd.init(() => {
    nodes.forEach(node => {
        const [x, y] = [node[1], node[2]];
        graph.at(x, y).newNode(node[0]);
    });
    links.forEach(([x, y]) => {
        graph.link(x, y);
        graph.element(x, y).arrow();
    });
});

sd.main(async () => {});
