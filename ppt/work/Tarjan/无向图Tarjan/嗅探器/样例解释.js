import * as sd from "@/sd";

const svg = sd.svg();
const links = [
    [2, 1],
    [2, 5],
    [1, 4],
    [5, 3],
    [2, 3],
    [5, 1],
    [1, 6],
];
const nodes = [1, 2, 3, 5, 4, 6];
const graph = new sd.TinyGraph(svg);

sd.init(() => {
    nodes.forEach(node => graph.newNode(node));
    links.forEach(([x, y]) => {
        graph.link(x, y);
    });
    sd.Pointer(graph, "a", "r").moveTo(4);
    sd.Pointer(graph, "b", "r").moveTo(2);
});

sd.main(async () => {});
