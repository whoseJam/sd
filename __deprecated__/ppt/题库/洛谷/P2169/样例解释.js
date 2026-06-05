import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const graph = new sd.GridGraph(svg).width(300).height(100);
const nodes = [
    [1, 0, 0],
    [2, 0, 0.5],
    [3, 1, 0.5],
    [4, 1, 0],
    [5, 0.5, 1],
];
const links = [
    [1, 2, 1, "cx", "my"],
    [2, 3, 6, "x", "cy"],
    [3, 4, 1, "cx", "y"],
    [4, 2, 1, "mx", "my"],
    [3, 5, 2, "x", "y"],
];

sd.init(() => {
    nodes.forEach(([id, x, y]) => {
        graph.at(x, y).newNode(id);
    });
    links.forEach(link => {
        const x = link[3] || "cx";
        const y = link[4] || "cy";
        graph.link(link[0], link[1]);
        graph.element(link[0], link[1]).arrow().value(link[2], R.pointAtPathByRate(0.5, x, y));
    });
});

sd.main(async () => {});
