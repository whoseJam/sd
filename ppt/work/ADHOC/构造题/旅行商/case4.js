import * as sd from "@/sd";
import { Graph } from "../景点环游/Graph";

const svg = sd.svg();
const C = sd.color();
const graph = new Graph(svg, 6);

sd.init(() => {
    for (let i = 1; i <= 2; i++) graph.element(i, i + 1).color(C.red);
    for (let i = 3; i < 6; i++) graph.element(i, i + 1).color(C.textBlue);
});

sd.main(async () => {
    await sd.pause();
    sd.Link(graph.vertex(), graph.S()).stroke(C.textBlue).startAnimate().pointStoT().endAnimate();
    sd.Link(graph.vertex(), graph.T()).stroke(C.textBlue).startAnimate().pointStoT().endAnimate();
});
