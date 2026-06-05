import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const V = sd.vec();
const n = 8;
const bi = new sd.BipartiteGraph(svg).height(200);
const vis = sd.make1d(100, 0);
const mat = sd.make1d(100, 0);
let stk;
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
    const h = Math.floor(n / 2);
    for (let i = 1; i <= h; i++) bi.newNode(i, 0);
    for (let i = h + 1; i <= n; i++) bi.newNode(i, 1);
    links.forEach(link => bi.link(link[0], link[1]));
});

sd.main(async () => {
    const h = Math.floor(n / 2);
    for (let i = 1; i <= h; i++) {
        memset(vis, 0);
        stk = [];
        Dfs(i);
        await AugmentingPath(stk.reverse());
    }
});

function Dfs(u) {
    for (let link of bi.outLinks(u, "undirect")) {
        const v = +bi.toNodeId(link, u);
        if (!vis[v]) {
            vis[v] = 1;
            if (!mat[v] || Dfs(mat[v])) {
                stk.push(v);
                stk.push(u);
                mat[v] = u;
                return true;
            }
        }
    }
    return false;
}

function memset(arr, value) {
    for (let i = 0; i < arr.length; i++) arr[i] = value;
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
