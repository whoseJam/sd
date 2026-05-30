import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 3;
const m = 7;
const A = 2;
const B = 5;
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
    graph.color(A, C.blue).color(n + B, C.blue);
});

sd.main(async () => {
    await sd.pause();
    const bj = new sd.BraceCurve(graph)
        .target(graph.x(), graph.my() + 30)
        .source(graph.element(n + B).cx(), graph.my() + 30)
        .value("j", R.pointAtPathByRate(0.5, "cx", "y"));
    const bi = new sd.BraceCurve(graph)
        .source(graph.x() - 30, graph.my())
        .target(graph.x() - 30, graph.element(A).cy())
        .value("i", R.pointAtPathByRate(0.5, "mx", "cy"));
    function appear(obj) {
        obj.opacity(0).startAnimate().opacity(1).endAnimate();
    }
    appear(bi);
    appear(bj);
});
