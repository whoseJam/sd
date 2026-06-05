import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 18;
const links = [
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [3, 6],
    [3, 7],
    [4, 8],
    [5, 9],
    [5, 10],
    [6, 11],
    [7, 12],
    [8, 13],
    [8, 14],
    [10, 15],
    [11, 16],
    [16, 17],
    [16, 18],
];
const tree = new sd.Tree(svg).layerHeight(60).width(1100).cx(600).y(50);
const arr = new sd.Array(svg).x(100).cy(500).start(1);
const brace = sd.Brace(arr);

const sz = sd.make1d(100, 0);
const fa = sd.make1d(100, 0);
const dep = sd.make1d(100, 0);
const sn = sd.make1d(100, 0);
const top = sd.make1d(100, 0);
const pos = sd.make1d(100, 0);
const rpos = sd.make1d(100, 0);

sd.init(() => {
    tree.root(1);
    links.forEach(link => tree.link(link[0], link[1]));
});

sd.main(async () => {
    await sd.pause();
    tree.startAnimate();
    dfs1(1, 0);
    tree.endAnimate();
    await dfs2(1, 1);
});

function dfs1(current, parent) {
    sz[current] = 1;
    fa[current] = parent;
    dep[current] = dep[parent] + 1;
    const children = tree.children(current);
    for (let child of children) {
        const v = +tree.nodeId(child);
        dfs1(v, current);
        if (sz[sn[current]] < sz[v]) sn[current] = v;
        sz[current] += sz[v];
    }
    if (sn[current]) {
        tree.element(current, sn[current]).strokeWidth(5);
        tree.element(current, sn[current]).stroke(C.red);
    }
}

async function dfs2(current, t) {
    await sd.pause();
    tree.startAnimate();
    if (fa[current]) tree.color(fa[current], C.white);
    tree.color(current, C.green);
    tree.endAnimate();

    await sd.pause();
    arr.startAnimate().push(`${current}`).endAnimate();
    pos[current] = arr.length();
    rpos[arr.length()] = current;
    top[current] = t;

    await sd.pause();
    const l1 = linkTo(tree.element(current), arr.element(arr.end()), "pos");
    const l2 = linkTo(arr.element(arr.end()), tree.element(current), "rpos");
    const l3 = linkTo(tree.element(current), tree.element(t), "top");

    await sd.pause();
    l1.startAnimate().opacity(0).remove();
    l2.startAnimate().opacity(0).remove();
    l3.startAnimate().opacity(0).remove();

    if (sn[current]) await dfs2(sn[current], t);

    const children = tree.children(current);
    for (let child of children) {
        const v = +tree.nodeId(child);
        if (v !== fa[current] && v !== sn[current]) {
            await dfs2(v, v);
        }
    }

    await sd.pause();
    tree.startAnimate();
    if (fa[current]) tree.color(fa[current], C.green);
    tree.color(current, C.white);
    tree.endAnimate();
}

function linkTo(elementA, elementB, label) {
    const l = new sd.Curve(svg);
    l.source(elementA.center()).target(elementB.pos("cx", "cy"));
    sd.trim(l, elementA, elementB);
    l.value(new sd.Text(l, label).color(C.textBlue).opacity(0).startAnimate().opacity(1).endAnimate());
    l.startAnimate().pointStoT().endAnimate().arrow();
    return l;
}
