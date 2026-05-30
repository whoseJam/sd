import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const graph1 = new sd.GridGraph(svg).height(200).cx(500).cy(300);
const graph2 = new sd.GridGraph(svg).height(200).cx(700).cy(300);

sd.init(() => {
    function initGraph(graph) {
        graph.at(0, 0.5).newNode(1);
        graph.at(1, 0.5).newNode(2);
    }
    initGraph(graph1);
    initGraph(graph2);
    graph1.newLink(1, 2);
    const e = graph1.element(1, 2).arrow();
    e.childAs("maxFlow", new sd.Text(e, 100), R.pointAtPathByRate(0.5, "mx", "cy", -10));
    e.childAs("minFlow", new sd.Text(e, 20), R.pointAtPathByRate(0.5, "x", "cy", 10));
});

sd.main(async () => {
    await sd.pause();
    graph2.startAnimate().newLink(1, 2);
    const e = graph2.element(1, 2);
    e.value(80);
    e.after(0).arrow();
    graph2.endAnimate();
    await sd.pause();
    const v1 = graph2.element(1);
    const v2 = graph2.element(2);
    const l1 = new sd.Line(v1);
    l1.source(v1.cx(), v1.cy());
    l1.target(v1.cx() + 50, v1.cy() + 50);
    const l2 = new sd.Line(v2);
    l2.target(v2.cx(), v2.cy());
    l2.source(v2.cx() + 50, v2.cy() - 50);
    sd.trim(l1, v1, null);
    sd.trim(l2, null, v2);
    l1.arrow().opacity(0).startAnimate().opacity(1).value(20).endAnimate();
    l2.arrow().opacity(0).startAnimate().opacity(1).value(20).endAnimate();
    await sd.pause();
});
