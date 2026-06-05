import * as sd from "@/sd";
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
new MatchingGraph(svg, n, links, true);

sd.init(() => {});

sd.main(async () => {});
