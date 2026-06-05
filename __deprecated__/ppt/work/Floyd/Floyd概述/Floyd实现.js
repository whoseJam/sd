import * as sd from "@/sd";
import { floyd } from "../_/Floyd";

const svg = sd.svg();
const R = sd.rule();
const graph = new sd.GridGraph(svg).n(1).m(1).width(200).height(200).cx(400).cy(300);
const links = [
    [1, 2, 3, "mx", "my"],
    [1, 3, 8, "x", "my"],
    [2, 3, 1, "cx", "my"],
    [2, 4, 6, "mx", "y"],
    [3, 4, 2, "x", "y"],
];

sd.init(() => {
    graph.at(0, 0.5).newNode(1);
    graph.at(0.5, 0).newNode(2);
    graph.at(0.5, 1).newNode(3);
    graph.at(1, 0.5).newNode(4);
    links.forEach(item => {
        const x = item[3] || "cx";
        const y = item[4] || "cy";
        graph.newLink(item[0], item[1]);
        graph.element(item[0], item[1]).arrow().value(item[2], R.pointAtPathByRate(0.5, x, y));
    });
});

sd.main(async () => {
    await floyd(graph);
});
