import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const links = [
    [1, 2, 12, "mx", "my"],
    [1, 3, 14, "mx", "y"],
    [1, 4, 16, "cx", "my"],
    [2, 4, 7, "x", "my"],
    [2, 5, 10, "cx", "my"],
    [3, 4, 9, "x", "y"],
    [3, 6, 8, "cx", "y"],
    [4, 5, 6, "mx", "my"],
    [4, 6, 2, "mx", "y"],
    [5, 6, 5, "x", "cy"],
    [5, 7, 3, "x", "my"],
    [6, 7, 4, "x", "y"],
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
    links.forEach(link => {
        const x = link[3] || "cx";
        const y = link[4] || "cy";
        graph.newLink(link[0], link[1]);
        graph.element(link[0], link[1]).value(link[2], R.pointAtPathByRate(0.5, x, y));
    });
});

sd.main(async () => {
    await Dijkstra(graph);
});

/**
 * @param {sd.GraphBase} graph
 */
async function Dijkstra(graph) {
    const getDis = x => {
        const text = graph.element(x).child("dis").text();
        if (text === "inf") return Infinity;
        return +text;
    };
    const putDis = (x, dis) => graph.element(x).child("dis").text(dis);
    const n = graph.nodes().length;
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        let [u, disu] = [undefined, Infinity];
        for (let j = 1; j <= n; j++) {
            if (graph.element(j).vis) continue;
            if (disu > getDis(j)) {
                disu = getDis(j);
                u = j;
            }
        }
        graph.element(u).vis = true;
        graph.startAnimate().color(u, C.blue).endAnimate();
        const outLinks = graph.outLinks(u, "undirect");
        for (let link of outLinks) {
            const v = graph.toNodeId(link, u);
            if (getDis(v) > getDis(u) + link.intValue()) {
                await sd.pause();
                graph.startAnimate().color(v, C.green).endAnimate();
                await sd.pause();
                graph.startAnimate();
                putDis(v, getDis(u) + link.intValue());
                graph.endAnimate();
                await sd.pause();
                graph.startAnimate().color(v, C.white).endAnimate();
            }
        }
        await sd.pause();
        graph.startAnimate().color(u, C.grey).endAnimate();
    }
}
