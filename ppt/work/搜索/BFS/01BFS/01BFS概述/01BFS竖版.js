import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();

const graph = new sd.GridGraph(svg).width(100).height(250);
const Q = new sd.Array(svg);
const disLoc = ["tc", "lc", "rc", "rc", "lc", "bc"];
const links = [
    [1, 2, 0, "mx", "cy"],
    [1, 3, 1, "x", "cy"],
    [2, 3, 1, "cx", "y"],
    [2, 5, 0, "mx", "cy"],
    [3, 4, 1, "x", "cy"],
    [4, 5, 1, "cx", "my"],
    [5, 6, 0, "mx", "cy"],
    [4, 6, 0, "x", "cy"],
];

sd.init(() => {
    graph.at(0, 0.5).newNode(1);
    graph.at(0.3, 0).newNode(2);
    graph.at(0.3, 1).newNode(3);
    graph.at(0.7, 1).newNode(4);
    graph.at(0.7, 0).newNode(5);
    graph.at(1, 0.5).newNode(6);
    links.forEach(link => {
        const x = link[3] || "cx";
        const y = link[4] || "cy";
        graph.newLink(link[0], link[1]);
        graph.element(link[0], link[1]).value(link[2], R.pointAtPathByRate(0.5, x, y));
    });
    sd.Label(Q, "队列Q", "lc");
    Q.x(graph.x())
        .y(graph.my() + 60)
        .push(1);
    for (let i = 1; i <= 6; i++) {
        const text = i === 1 ? "dis=0" : "dis=inf";
        const label = sd.Label(graph.element(i), text, disLoc[i - 1]);
        graph.element(i).label = label;
        graph.element(i).dis = Infinity;
    }
    graph.element(1).dis = 0;
});
sd.main(async () => {
    while (Q.length()) {
        await sd.pause();
        const u = Q.intValue(0);
        const nodeU = graph.element(u);
        Q.startAnimate().color(0, C.blue).endAnimate();
        graph.startAnimate().color(u, C.blue).endAnimate();

        const to = graph.outLinks(u, "undirect");
        for (let i = 0; i < to.length; i++) {
            const v = graph.toNodeId(to[i], u);
            const w = to[i].intValue();
            const nodeV = graph.element(v);
            if (nodeV.dis > nodeU.dis + w) {
                await sd.pause();
                nodeV.label
                    .startAnimate()
                    .text(`dis=${(nodeV.dis = nodeU.dis + w)}`)
                    .endAnimate();
                nodeV.label.startAnimate().opacity(1).endAnimate();
                if (w === 0) {
                    await sd.pause();
                    Q.startAnimate().insert(1, v).endAnimate();
                } else {
                    await sd.pause();
                    Q.startAnimate().push(v).endAnimate();
                }
            }
        }
        await sd.pause();
        Q.startAnimate().erase(0).endAnimate();
        graph.startAnimate().color(u, C.white).endAnimate();
    }
});
