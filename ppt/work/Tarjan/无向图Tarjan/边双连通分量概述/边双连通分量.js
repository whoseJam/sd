import * as sd from "@/sd";
import { HugeGraph } from "../_/HugeGraph.js";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const graph = new HugeGraph(svg);
const colorList = [C.orange, C.blue, C.green, C.red, C.yellow];

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        graph
            .element(i)
            .startAnimate()
            .color(colorList[i - 1])
            .endAnimate();
    }
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        compress(graph.element(i));
    }
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        const sub = graph.element(i);
        const circle = new sd.Circle(svg)
            .r(sub.width() / 2)
            .center(sub.center())
            .fillOpacity(0)
            .opacity(0)
            .startAnimate()
            .opacity(1)
            .endAnimate();
        graph.element(i).circle = circle;
    }
    await sd.pause();
    graph.forEachExternLink((link, g1, x1, g2, x2) => {
        link.startAnimate();
        link.sourceElement(graph.element(g1).circle);
        link.targetElement(graph.element(g2).circle);
        link.endAnimate();
    });
});

function compress(graph) {
    graph.startAnimate();
    graph.forEachNode(node => node.r(10));
    const center = graph.center();
    graph.scale(0.5);
    graph.center(center);
    graph.endAnimate();
}
