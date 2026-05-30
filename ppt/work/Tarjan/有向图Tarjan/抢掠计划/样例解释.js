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
    [1, 0, 0, 10, "tc"],
    [2, 0, 0.33, 12, "tc"],
    [3, 0, 0.66, 8, "tc"],
    [5, 0, 1, 1, "tc"],
    [4, 1, 0.33, 16, "bc"],
    [6, 1, 0.66, 5, "bc"],
];

sd.init(() => {
    nodes.forEach(node => {
        const [x, y] = [node[1], node[2]];
        graph.at(x, y).newNode(node[0]);
        sd.Label(graph.element(node[0]), node[3], node[4], 15, 0);
    });
    links.forEach(([x, y]) => {
        graph.link(x, y);
        graph.element(x, y).arrow();
    });
});

sd.main(async () => {});
