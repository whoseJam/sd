import * as sd from "@/sd";
import { flow } from "../_/Flow";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg).width(200).height(200);
const links = [
    // format: x y capacity
    [1, 2, 4, "mx", "my"],
    [1, 3, 2, "x", "my"],
    [2, 3, 1, "cx", "my"],
    [2, 4, 2, "mx", "cy"],
    [2, 5, 4, "x", "y"],
    [3, 5, 2, "x", "cy"],
    [4, 6, 3, "mx", "y"],
    [5, 6, 3, "x", "y"],
];

sd.init(() => {
    graph.at(0, 0.5).newNode(1, "A");
    graph.at(0.25, 0).newNode(2, "B");
    graph.at(0.25, 1).newNode(3, "C");
    graph.at(0.75, 0).newNode(4, "D");
    graph.at(0.75, 1).newNode(5, "E");
    graph.at(1, 0.5).newNode(6, "F");
    links.forEach(link => {
        const rule = R.pointAtPathByRate(0.5, link[3], link[4]);
        const math = new sd.Math(svg, link[2]).fontSize(20);
        graph.newLink(link[0], link[1]);
        graph.element(link[0], link[1]).arrow().value(math, rule);
    });
});

sd.main(async () => {
    await flow(graph, [
        { from: 1, to: 2 },
        { from: 2, to: 5 },
        { from: 5, to: 6 },
    ]);
    await flow(graph, [
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 4, to: 6 },
    ]);
});
