import * as sd from "@/sd";
import { toposort } from "../_/Toposort";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.DAG(svg).width(200).height(200); // type: Node
const nodes = [1, 2, 3, 4, 5, 6, 7, 8];
const links = [
    [1, 3],
    [2, 3],
    [2, 4],
    [3, 4],
    [4, 5],
    [4, 6],
    [8, 6],
    [1, 7],
    [7, 8],
];

sd.init(() => {
    for (let i = 0; i < nodes.length; i++) {
        graph.newNode(nodes[i]);
        graph.element(nodes[i]);
    }
    for (let i = 0; i < links.length; i++) {
        const x = links[i][0];
        const y = links[i][1];
        graph.newLink(x, y);
        graph.element(x, y).arrow();
    }
    graph.cx(600).cy(300);
});

sd.main(async () => {
    await toposort(graph, 40);
    await sd.pause();
});
