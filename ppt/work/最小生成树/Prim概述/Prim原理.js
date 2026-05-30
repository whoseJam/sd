import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg);
const dis = sd.make1d(100, Infinity);
const vis = sd.make1d(100, false);
const prt = sd.make1d(100, 0);
const n = 6;
const links = [
    [1, 2, 4, "mx", "my"],
    [2, 4, 2, "x", "cy"],
    [1, 6, 6, "x", "my"],
    [4, 1, 5, "cx", "my"],
    [5, 6, 3, "x", "my"],
    [2, 5, 1, "x", "my"],
    [3, 5, 7, "x", "cy"],
];

const disLabel = ["rc", "lc", "lc", "lc", "tc", "rc"];

sd.init(() => {
    graph.at(0, 0.5).newNode(1);
    graph.at(0.5, 0).newNode(2);
    graph.at(1, 0.5).newNode(3);
    graph.at(0, 0).newNode(4);
    graph.at(0.5, 0.5).newNode(5);
    graph.at(0.5, 1).newNode(6);
    links.forEach(link => {
        const x = link[0];
        const y = link[1];
        const v = link[2];
        graph.link(x, y);
        graph.element(x, y).value(v, R.pointAtPathByRate(0.5, link[3] || "cx", link[4] || "cy"));
    });
});

sd.main(async () => {
    dis[1] = 0;
    for (let i = 1; i <= n; i++) {
        let dis_ = Infinity;
        let u_ = 0;
        for (let u = 1; u <= n; u++) {
            if (dis_ > dis[u] && !vis[u]) {
                dis_ = dis[u];
                u_ = u;
            }
        }
        await sd.pause();
        vis[u_] = 1;
        graph.startAnimate();
        graph.color(u_, C.red);
        let link = graph.element(prt[u_], u_);
        if (!link) link = graph.element(u_, prt[u_]);
        if (link) link.stroke(C.red).strokeWidth(3);
        graph.endAnimate();

        const out = graph.outLinks(u_, "undirect");
        for (let i = 0; i < out.length; i++) {
            const v = graph.toNodeId(out[i], u_);
            if (dis[v] > out[i].intValue() && !vis[v]) {
                dis[v] = out[i].intValue();
                prt[v] = u_;
            }
        }
        await sd.pause();
        graph.startAnimate().color(u_, C.blue).endAnimate();
    }
});
