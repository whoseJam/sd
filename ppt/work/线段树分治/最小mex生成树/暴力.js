import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const graph = new sd.TinyGraph(svg);
const n = 6;
const links = [
    [1, 2, 0, "mx", "my"],
    [1, 4, 0, "mx", "cy"],
    [2, 3, 1, "mx", "cy"],
    [3, 4, 1, "mx", "y"],
    [1, 6, 2, "x", "my"],
    [6, 5, 2, "mx", "cy"],
    [1, 5, 3, "x", "my"],
];

sd.init(() => {
    for (let i = 1; i <= n; i++) graph.newNode(i);
    links.forEach(link => {
        graph.link(link[0], link[1]);
        graph.element(link[0], link[1]).value(link[2], R.pointAtPathByRate(0.5, link[3], link[4]));
    });
});

sd.main(async () => {
    for (let i = 0; ; i++) {
        await sd.pause();
        let blockCount = n;
        const fa = sd.make1d(n + 1);
        for (let j = 1; j <= n; j++) fa[j] = j;
        function getFa(x) {
            if (fa[x] === x) return x;
            return (fa[x] = getFa(fa[x]));
        }
        function merge(x, y) {
            const fx = getFa(x);
            const fy = getFa(y);
            if (fx !== fy) {
                fa[fx] = fy;
                blockCount--;
            }
        }
        graph.forEachLink(link => {
            if (link.intValue() === i) {
                link.startAnimate().opacity(0.2).endAnimate();
            } else {
                link.startAnimate().opacity(1).endAnimate();
                merge(graph.sourceId(link), graph.targetId(link));
            }
        });
        if (blockCount === 1) break;
    }
});
