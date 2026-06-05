import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const links = [
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 4],
    [2, 5],
    [3, 4],
    [3, 6],
    [4, 5],
    [4, 6],
    [5, 6],
    [5, 7],
    [6, 7],
];
const nodes = [
    [1, 0.5, 0, 0, "lc"],
    [2, 0, 0.25, "inf", "tc"],
    [3, 1, 0.25, "inf", "bc"],
    [4, 0.5, 0.5, "inf", "rc"],
    [5, 0, 0.75, "inf", "tc"],
    [6, 1, 0.75, "inf", "bc"],
    [7, 0.5, 1, "inf", "rc"],
];
const graph = new sd.GridGraph(svg).width(400).height(200).cx(600).cy(300);

sd.init(() => {
    nodes.forEach(node => {
        graph.at(node[1], node[2]).newNode(node[0]);
        graph.element(node[0]).childAs("dis", new sd.Text(graph, node[3]), R.aside(node[4]));
    });
    links.forEach(([x, y]) => {
        graph.newLink(x, y);
    });
});

sd.main(async () => {
    const Q = [1];
    const getDis = x => {
        const text = graph.element(x).child("dis").text();
        if (text === "inf") return Infinity;
        return +text;
    };
    const putDis = (x, dis) => graph.element(x).child("dis").text(dis);
    while (Q.length > 0) {
        await sd.pause();
        const u = Q[0];
        Q.shift();
        graph.startAnimate().color(u, C.blue).endAnimate();
        const to = graph.outNodes(u, "undirect");
        for (const v of to) {
            const toId = graph.nodeId(v);
            if (getDis(toId) === Infinity) {
                await sd.pause();
                graph.startAnimate().color(toId, C.green).endAnimate();
                await sd.pause();
                graph.startAnimate();
                putDis(toId, getDis(u) + 1);
                graph.endAnimate();
                Q.push(toId);
                await sd.pause();
                graph.startAnimate().color(toId, C.white).endAnimate();
            }
        }
        await sd.pause();
        graph.startAnimate().color(u, C.grey).endAnimate();
    }
});
