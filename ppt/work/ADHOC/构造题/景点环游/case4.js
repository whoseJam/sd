import * as sd from "@/sd";
import { Graph } from "./Graph";

const svg = sd.svg();
const graph = new Graph(svg, 6);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    sd.Link(graph.S(), graph.vertex()).startAnimate().pointStoT().endAnimate().arrow();
    sd.Link(graph.vertex(), graph.T()).startAnimate().pointStoT().endAnimate().arrow();
});
