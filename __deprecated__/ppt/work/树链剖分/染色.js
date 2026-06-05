import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 13;
const links = [
    [1, 2],
    [2, 3],
    [3, 4],
    [3, 5],
    [4, 6],
    [5, 7],
    [7, 8],
    [8, 9],
    [8, 10],
    [9, 11],
    [10, 12],
    [12, 13],
];
const colors = [C.orange, C.green, C.green, C.orange, C.blue, C.green, C.green, C.blue, C.blue, C.blue, C.orange, C.orange, C.green];
const tree = new sd.Tree(svg).layerHeight(60).width(600).x(50).y(50);
const arr = new sd.Array(svg).x(550).cy(300).start(1);
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
    colors.forEach((color, idx) => tree.color(idx + 1, color));
});

sd.main(async () => {
    await sd.pause();
    tree.startAnimate();
    dfs1(1, 0);
    tree.endAnimate();

    await sd.pause();
    arr.startAnimate();
    dfs2(1, 1);
    arr.endAnimate();

    await climbOnTree(6, 11, "Query");
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

function dfs2(current, t) {
    arr.push(`${current}`);
    arr.color(arr.end(), tree.color(current));
    top[current] = t;
    pos[current] = arr.length();
    rpos[arr.length()] = current;
    if (sn[current]) dfs2(sn[current], t);
    const children = tree.children(current);
    for (let child of children) {
        const v = +tree.nodeId(child);
        if (v !== fa[current] && v !== sn[current]) {
            dfs2(v, v);
        }
    }
}

async function climbOnTree(x, y, operator) {
    await sd.pause();
    let fx = top[x],
        fy = top[y];
    const px = sd.Pointer(tree, "x", "r").startAnimate().moveTo(x).endAnimate();
    const py = sd.Pointer(tree, "y", "l").startAnimate().moveTo(y).endAnimate();
    const pfx = sd.Pointer(tree, "fx", "r").startAnimate().moveTo(fx).endAnimate();
    const pfy = sd.Pointer(tree, "fy", "l").startAnimate().moveTo(fy).endAnimate();
    while (fx !== fy) {
        if (dep[fx] < dep[fy]) {
            await sd.pause();
            let tmp = fx;
            fx = fy;
            fy = tmp;
            tmp = x;
            x = y;
            y = tmp;
            tree.startAnimate();
            px.moveTo(x);
            py.moveTo(y);
            pfx.moveTo(fx);
            pfy.moveTo(fy);
            tree.endAnimate();
        }
        await focusSequence(fx, x, pos[fx], pos[x], "pos[fx]", "pos[x]", operator);
        await sd.pause();
        px.startAnimate()
            .moveTo((x = fa[fx]))
            .endAnimate();
        await sd.pause();
        pfx.startAnimate()
            .moveTo((fx = top[x]))
            .endAnimate();
    }
    await sd.pause();
    pfx.startAnimate().opacity(0).endAnimate();
    pfy.startAnimate().opacity(0).endAnimate();
    if (pos[x] > pos[y]) {
        await sd.pause();
        let tmp = x;
        x = y;
        y = tmp;
        px.startAnimate().moveTo(x).endAnimate();
        py.startAnimate().moveTo(y).endAnimate();
    }
    await focusSequence(x, y, pos[x], pos[y], "pos[x]", "pos[y]", operator);
    await sd.pause();
    px.startAnimate().opacity(0).endAnimate();
    py.startAnimate().opacity(0).endAnimate();
}

async function focusSequence(x, y, l, r, b1, b2, operator) {
    function linkTo(a, b, label) {
        const l = new sd.Curve(svg);
        l.source(tree.element(a).center()).target(arr.element(b).pos("cx", "my"));
        sd.trim(l, tree.element(a), arr.element(b));
        l.value(new sd.Text(l, label).color(C.textBlue).opacity(0).startAnimate().opacity(1).endAnimate());
        l.startAnimate().pointStoT().endAnimate().arrow();
        return l;
    }
    await sd.pause();
    const l1 = linkTo(x, l, b1);
    const l2 = linkTo(y, r, b2);
    brace.startAnimate().brace(l, r, "t", 10).value(operator).endAnimate();
    await sd.pause();
    l1.startAnimate().opacity(0).endAnimate().remove();
    l2.startAnimate().opacity(0).endAnimate().remove();
    brace.startAnimate().opacity(0).endAnimate();
}
