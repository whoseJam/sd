import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const V = sd.vec();
const graph = new sd.GridGraph(svg).width(100).height(200);

sd.init(() => {
    graph.at(0.5, 0).newNode(1, "A");
    graph.at(0, 1).newNode(2, "B");
    graph.at(0.33, 1).newNode(3, "C");
    graph.at(0.66, 1).newNode(4, "D");
    graph.at(1, 1).newNode(5, "E");
    for (let i = 2; i <= 5; i++) {
        graph.link(1, i);
        graph.element(1, i).arrow();
    }
    new sd.Line(svg)
        .source(V.add(graph.element(1).pos("x", "cy"), [-50, 0]))
        .target(graph.element(1).pos("x", "cy"))
        .arrow();
    for (let i = 2; i <= 5; i++) {
        new sd.Line(svg)
            .source(graph.element(i).pos("mx", "cy"))
            .target(V.add(graph.element(i).pos("mx", "cy"), [50, 0]))
            .arrow();
    }
});

sd.main(async () => {
    await sd.pause();
    sd.Label(graph.element(1), "cur", "tc").opacity(0).startAnimate().opacity(1).endAnimate();
    for (let i = 2; i <= 5; i++) {
        await sd.pause();
        const line = new sd.Line(svg);
        line.stroke(C.red).strokeWidth(3);
        line.source(graph.element(1, i).source());
        line.target(graph.element(1, i).target());
        line.startAnimate().pointStoT().endAnimate().arrow();
        await sd.pause();
        line.startAnimate().fadeStoT().endAnimate().remove();
    }
});
