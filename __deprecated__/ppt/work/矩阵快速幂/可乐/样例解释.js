import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.TinyGraph(svg).height(200);
const links = [
    [1, 2],
    [2, 3],
];

sd.init(() => {
    links.forEach(link => {
        graph.link(link[0], link[1]);
        graph.element(link[0], link[1]).doubleArrow();
    });
    graph.color(1, C.green);
});

sd.main(async () => {
    await sd.pause();
    const focus = sd.Focus(graph).startAnimate().focus(1).endAnimate();
    graph.forEachNode(node => {
        node.onClick(() => {
            sd.inter(async () => {
                focus.startAnimate().focus(node).endAnimate();
            });
        });
    });
    await sd.pause();
    const B = new sd.Vertex(svg, "B").cx(graph.cx()).cy(graph.element(1).cy()).opacity(0).startAnimate().opacity(1).endAnimate();
    graph.forEachNode(node => {
        sd.Link(node, B, sd.Line).startAnimate().pointStoT().endAnimate().arrow();
    });
    await sd.pause();
    graph.forEachNode(node => {
        sd.Link(node, node, sd.CircleCurve).startAnimate().pointStoT().endAnimate().arrow();
    });
});
