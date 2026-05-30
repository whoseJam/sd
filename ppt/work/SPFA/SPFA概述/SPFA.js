import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const links = [
    [1, 2, 12, "mx", "my"],
    [1, 3, 14, "mx", "y"],
    [1, 4, 16, "cx", "my"],
    [2, 4, -7, "x", "my"],
    [2, 5, 10, "cx", "my"],
    [3, 4, 9, "x", "y"],
    [3, 6, 8, "cx", "y"],
    [4, 5, 6, "mx", "my"],
    [4, 6, -2, "mx", "y"],
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
        graph.element(node[0]).childAs("dis", new sd.Text(svg, node[3]), R.aside(node[4]));
    });
    links.forEach(link => {
        const x = link[3] || "cx";
        const y = link[4] || "cy";
        graph.newLink(link[0], link[1]);
        graph.element(link[0], link[1]).value(link[2], R.pointAtPathByRate(0.5, x, y)).arrow();
    });
});

sd.main(async () => {
    const inq = sd.make1d(100, false);
    const Q = new sd.Array(svg)
        .x(graph.x())
        .y(graph.my() + 100)
        .push(1);
    const getDis = x => {
        const text = graph.element(x).child("dis").text();
        if (text === "inf") return Infinity;
        return +text;
    };
    const putDis = (x, dis) => graph.element(x).child("dis").text(dis);
    const getInq = x => inq[x];
    const putInq = (x, inq_) => (inq[x] = inq_);
    sd.Label(Q, "队列Q");
    let cnt = 0;
    while (Q.length() > 0 && ++cnt <= 20) {
        await sd.pause();
        let u = Q.firstElement().value().text();
        Q.startAnimate().color(0, C.blue).endAnimate();
        graph.startAnimate().color(u, C.blue).endAnimate();
        const outLinks = graph.outLinks(u, "direct");
        for (let link of outLinks) {
            const v = graph.toNodeId(link, u);
            if (getDis(v) > getDis(u) + link.intValue()) {
                await sd.pause();
                graph.startAnimate().color(v, C.green).endAnimate();
                await sd.pause();
                graph.startAnimate();
                putDis(v, getDis(u) + link.intValue());
                graph.endAnimate();
                if (!getInq(v)) {
                    await sd.pause();
                    graph.startAnimate();
                    putInq(v, 1);
                    graph.endAnimate();
                    Q.startAnimate().push(v).endAnimate();
                }
                await sd.pause();
                graph.startAnimate().color(v, C.white).endAnimate();
            }
        }
        await sd.pause();
        Q.startAnimate().erase(0).endAnimate();
        graph.startAnimate();
        graph.color(u, C.white);
        putInq(u, 0);
        graph.endAnimate();
    }
});
