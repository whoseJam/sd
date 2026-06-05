import * as sd from "@/sd";
import { Graph } from "../景点环游/Graph";

const svg = sd.svg();
const graph = new Graph(svg, 6);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    sd.Link(graph.vertex(), graph.S()).startAnimate().pointStoT().endAnimate().arrow();
    sd.Link(graph.vertex(), graph.T()).startAnimate().pointStoT().endAnimate().arrow();
});
