import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const V = sd.vec();
const n = 8;
const bi = new sd.BipartiteGraph(svg).x(200).y(100).height(200);
const links = [
    [1, 5],
    [1, 6],
    [2, 5],
    [2, 7],
    [3, 6],
    [3, 8],
    [4, 6],
    [4, 7],
];

sd.init(() => {
    const h = n / 2;
    for (let i = 1; i <= h; i++) bi.newNode(i, 0);
    for (let i = h + 1; i <= n; i++) bi.newNode(i, 1);
    links.forEach(link => bi.link(link[0], link[1]));
});

sd.main(async () => {
    await Match([
        [1, 5],
        [2, 7],
        [3, 8],
    ]);
    await AugmentingPath([4, 7, 2, 5, 1, 6]);
});

async function Match(matches) {
    await sd.pause();
    matches.forEach(match => {
        const link = bi.element(match[0], match[1]);
        link.startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
    });
}

async function AugmentingPath(path) {
    await sd.pause();
    const pen = new sd.PathPen();
    pen.MoveTo(V.add(bi.element(path[0]).center(), [5, 0]));
    for (let i = 1; i < path.length; i++) {
        pen.LineTo(V.add(bi.element(path[i]).center(), [5, 0]));
    }
    const d = new sd.Path(svg).d(pen.toString()).stroke(C.textBlue).strokeWidth(2);
    d.startAnimate(300 * (path.length - 1))
        .pointStoT()
        .endAnimate()
        .arrow();

    await sd.pause();
    const tree = new sd.HorizontalValueTree(svg).height(40);
    tree.startAnimate().freeze();
    for (let i = 0; i < path.length; i++) {
        const v = new sd.Vertex(tree, path[i]).center(bi.element(path[i]).center());
        tree.newNodeFromExistElement(path[i], v);
    }
    for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i + 1];
        const l0 = bi.element(Math.min(u, v), Math.max(u, v));
        const l = new sd.Line(tree)
            .strokeWidth(l0.strokeWidth())
            .stroke(l0.stroke())
            .source(l0.source())
            .target(l0.target());
        tree.newLinkFromExistElement(u, v, l);
    }
    tree.unfreeze()
        .cx(bi.cx())
        .y(bi.my() + 20)
        .endAnimate();

    await sd.pause();
    d.startAnimate(300 * (path.length - 1))
        .fadeStoT()
        .endAnimate()
        .remove();

    await sd.pause();
    for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i + 1];
        const lt = tree.element(u, v);
        if (lt.stroke() === C.red) lt.startAnimate().stroke(C.black).strokeWidth(1).endAnimate();
        else lt.startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
        const lg = bi.element(Math.min(u, v), Math.max(u, v));
        if (lg.stroke() === C.red) lg.startAnimate().stroke(C.black).strokeWidth(1).endAnimate();
        else lg.startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
    }

    await sd.pause();
    tree.startAnimate().opacity(0).endAnimate().remove();
}
