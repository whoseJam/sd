import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 10;
const arr = new sd.Array(svg).elementWidth(80);
const stk = new sd.Stack(svg).resize(10);
const graph = new sd.GridGraph(svg);
const data = [];

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        arr.push(new sd.Math(arr, `Value_{${i}}`));
        stk.element(i - 1).childAs("impact", new sd.Array(stk).elementWidth(10).elementHeight(10), R.aside("rc", 10));
        arr.element(i - 1).rate(1.5);
    }
    stk.add = function (x) {
        const impact = this.element(x).child("impact");
        impact.push().color(impact.end(), C.RED);
        return this;
    };
    arr.cx(600).cy(150);
    stk.mx(arr.x() - 60).y(arr.my());
    graph.x(arr.x()).y(arr.my());
    graph.width(arr.width()).height(stk.height());
    graph.n(n).m(n);
    for (let i = 0; i < n; i++) {
        const a = sd.rand(0, n - 1);
        graph.at(a + 0.5, i + 0.5).newNode(i + 1, " ");
        graph
            .element(i + 1)
            .color(C.ORANGE)
            .r(15);
        data.push({
            x: i,
            y: a,
            circ: graph.element(i + 1),
        });
    }
    const arrowA = new sd.Line(graph)
        .source(graph.x() - 140, graph.my() + 30)
        .target(graph.mx() + 50, graph.my() + 30)
        .arrow();
    sd.Label(arrowA, "i轴", "br");
    const arrowB = new sd.Line(graph)
        .source(graph.x() - 140, graph.my() + 30)
        .target(graph.x() - 140, graph.y() - 50)
        .arrow();
    sd.Label(arrowB, "a轴", "lt");
});

sd.main(async () => {
    const focus = sd.Focus(stk);
    for (let i = 0; i < 10; i++) {
        await sd.pause();
        arr.startAnimate();
        arr.color(i, C.green);
        arr.endAnimate();
        data[i].circ.startAnimate().color(C.GREEN).endAnimate();

        if (data[i].y - 1 >= 0) {
            await sd.pause();
            focus
                .startAnimate()
                .focus(0, data[i].y - 1)
                .endAnimate();
        }

        await sd.pause();
        focus.startAnimate().focus(null).endAnimate();

        await sd.pause();
        stk.startAnimate().add(data[i].y).endAnimate();

        await sd.pause();
        arr.startAnimate();
        arr.color(i, C.white);
        arr.endAnimate();
        data[i].circ.startAnimate().color(C.ORANGE).endAnimate();
    }
});
