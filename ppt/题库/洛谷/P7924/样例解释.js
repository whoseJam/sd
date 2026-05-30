import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.GridGraph(svg).width(300).height(100);
const nodes = [
    [1, 0, 0],
    [2, 0, 1],
    [3, 1, 1],
    [4, 1, 0],
    [5, 0.5, 0.5],
];
const links = [
    [1, 2],
    [2, 3],
    [1, 4],
    [4, 3],
    [3, 5],
];

sd.init(() => {
    nodes.forEach(([id, x, y]) => {
        graph.at(x, y).newNode(id);
    });
    links.forEach(link => {
        graph.link(link[0], link[1]);
    });
});

sd.main(async () => {
    await sd.pause();
    graph.forEachNode((node, id) => {
        if (id !== "5") node.startAnimate().color(C.blue).endAnimate();
    });
});
