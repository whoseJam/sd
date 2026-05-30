import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [3, 5],
    [3, 6],
    [4, 7],
    [4, 8],
    [4, 9],
    [5, 10],
    [5, 11],
];
const t = new sd.Tree(svg).width(1000).layerHeight(80).cx(600).y(50);

sd.init(() => {
    links.forEach(([x, y]) => {
        t.link(x, y);
    });
    t.forEachNode(node => node.opacity(0));
    t.forEachLink(link => link.opacity(0));
    t.nodeOpacity(1, 1);
});

sd.main(async () => {
    let queue = [1];
    let nextQueue = [];
    while (queue.length) {
        const callbacks = [];
        for (const u of queue) {
            const node = t.element(u);
            const children = t.children(u);
            for (const child of children) {
                nextQueue.push(t.nodeId(child));
                callbacks.push(() => {
                    child.startAnimate().opacity(1).endAnimate();
                    const link = t.element(node, child);
                    link.opacity(1).startAnimate().pointStoT().endAnimate();
                });
            }
        }
        if (callbacks.length > 0) {
            await sd.pause();
            callbacks.forEach(callback => {
                callback();
            });
        }
        [queue, nextQueue] = [nextQueue, []];
    }
    await sd.pause();
    t.startAnimate().color(1, C.blue).endAnimate();
    await sd.pause();
    t.startAnimate();
    t.color(3, C.orange);
    [5, 6].forEach(x => t.color(x, C.green));
    t.endAnimate();
    await sd.pause();
    t.startAnimate();
    [7, 8, 9, 10, 11, 6].forEach(x => {
        t.element(x).strokeWidth(3).stroke(C.red);
    });
    t.endAnimate();
    await sd.pause();
    for (let i = 1; i <= 3; i++) {
        new sd.Line(svg)
            .source(t.kx(0.1), t.y() + t.layerHeight() * (i - 0.5))
            .target(t.kx(0.9), t.y() + t.layerHeight() * (i - 0.5))
            .stroke(C.green)
            .strokeWidth(2)
            .startAnimate()
            .pointStoT()
            .endAnimate();
    }
});
