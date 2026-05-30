import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg);
const fa = sd.make1d(100);
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

sd.init(() => {
    graph.at(0, 0.5).newNode(1);
    graph.at(0.5, 0).newNode(2);
    graph.at(1, 0.5).newNode(3);
    graph.at(0, 0).newNode(4);
    graph.at(0.5, 0.5).newNode(5);
    graph.at(0.5, 1).newNode(6);
    for (let i = 1; i <= n; i++) fa[i] = i;
    links.forEach(link => {
        const x = link[0];
        const y = link[1];
        const v = link[2];
        graph.link(x, y);
        graph.element(x, y).value(v, R.pointAtPathByRate(0.5, link[3] || "cx", link[4] || "cy"));
    });
});

sd.main(async () => {
    await sd.pause();
    links.sort((a, b) => {
        return -a[2] + b[2];
    });
    graph.startAnimate();
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const [x, y, v] = link;
        let fx = getFa(x);
        let fy = getFa(y);
        if (fx !== fy) {
            fa[fx] = fy;
            graph.element(x, y).stroke(C.deepSkyBlue).strokeWidth(2);
        } else graph.element(x, y).stroke(C.grey).strokeDashArray([5, 5]);
        graph.element(x).color(C.white);
        graph.element(y).color(C.white);
    }
    graph.endAnimate();
});

function getFa(x) {
    if (fa[x] === x) return x;
    return getFa(fa[x]);
}
