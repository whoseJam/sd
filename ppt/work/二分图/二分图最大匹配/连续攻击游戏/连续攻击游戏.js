import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.BipartiteGraph(svg).height(200);
const edges = [
    ["1", "1'"],
    ["1", "2'"],
    ["2", "1'"],
    ["3", "2'"],
    ["4", "3'"],
    ["5", "3'"],
];

sd.init(() => {
    for (let i = 1; i <= 5; i++) {
        graph.newNode(`${i}`, new sd.Math(graph, `${i}`), 0);
        graph.element(`${i}`).rate(2);
    }
    for (let i = 1; i <= 3; i++) {
        graph.newNode(`${i}'`, new sd.Math(graph, `${i}'`), 1);
        graph.element(`${i}'`).rate(2);
    }
    for (let i = 0; i < edges.length; i++) graph.newLink(edges[i][0], edges[i][1]);
    sd.Label(graph, "属性点", "tc");
    sd.Label(graph, "武器点", "bc");
});

sd.main(async () => {});
