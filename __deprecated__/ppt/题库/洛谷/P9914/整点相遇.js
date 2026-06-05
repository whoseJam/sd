import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 2;
const m = 4;
const arrowA = new sd.Line(svg);
const arrowB = new sd.Line(svg);
const graph = new sd.GridGraph(svg)
    .n(n)
    .m(m)
    .height(n * 70)
    .width(m * 70);

sd.init(() => {
    arrowA
        .source(graph.x(), graph.my())
        .target(graph.mx() + 50, graph.my())
        .arrow();
    arrowB
        .source(graph.x(), graph.my())
        .target(graph.x(), graph.y() - 50)
        .arrow();
    sd.Label(arrowA, "x轴", "br");
    sd.Label(arrowB, "y轴", "lt");

    for (let i = 1; i <= n; i++) {
        graph.at(n - i, 0).newNode(i, new sd.Math(graph, `A_{${i}}`));
        graph.element(i).rate(1.8);
        graph.element(i).childAs("l", new sd.Line(svg).source(0, 0).target(20, 0).arrow(), R.aside("rc", 0));
    }
    for (let j = 1; j <= m; j++) {
        graph.at(n, j).newNode(n + j, new sd.Math(graph, `B_{${j}}`));
        graph.element(n + j).rate(1.8);
        graph.element(n + j).childAs("l", new sd.Line(svg).source(0, 0).target(0, -20).arrow(), R.aside("tc", 0));
    }
});

sd.main(async () => {
    await sd.pause();
    graph.startAnimate();
    graph.color(2, C.blue);
    graph.color(4, C.blue);
    graph.endAnimate();
    await sd.pause();
    const v = new sd.Circle(svg).r(5);
    v.cy(graph.element(2).cy());
    v.cx(graph.element(4).cx());
    v.childAs("math", new sd.Math(svg, "(2,2)"), R.aside("rc"));
    v.opacity(0).startAnimate().opacity(1).endAnimate();
});
