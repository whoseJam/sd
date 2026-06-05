import * as sd from "@/sd";
import { BinaryString } from "../_/BinaryString";
import { MatchingGraph } from "./MatchingGraph";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const links = [
    [1, 1],
    [1, 2],
    [2, 1],
    [2, 3],
    [3, 4],
    [3, 5],
    [4, 1],
    [4, 4],
    [4, 5],
    [5, 3],
    [5, 5],
];
const matches = [
    [1, 2],
    [2, 3],
];
const graph = new MatchingGraph(svg, n, links, true);
const status = new BinaryString(svg, n);

sd.init(() => {
    matches.forEach(match => {
        graph.match(match[0], match[1]);
        status.value(match[1], 1);
    });
    status.cx(graph.cx()).y(graph.my() + 20);
    sd.Pointer(graph, "i", "b").moveTo(matches.length);
});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(graph, "i+1", "b")
        .startAnimate()
        .moveTo(matches.length + 1)
        .endAnimate();
    await sd.pause();
    sd.Pointer(graph, "j", "t")
        .startAnimate()
        .moveTo(5 + n)
        .endAnimate();
    await sd.pause();
    graph.startAnimate().match(3, 5).endAnimate();
    await sd.pause();
    status.startAnimate().value(5, 1).endAnimate();
});
