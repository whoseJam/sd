import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg).x(300).y(120);
const vs = [];
const focus = sd.Focus(tree);
const edges = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
];
for (let i = 1; i <= 5; i++) {
    let a = new sd.Array(svg);
    sd.Label(a, `G[${i}]`);
    vs.push(a);
}

sd.init(() => {
    const x = 200;
    const y = 100;
    const dy = 50;
    for (let i = 0; i < vs.length; i++) {
        vs[i].x(x).y(y + i * dy);
    }
    for (const [x, y] of edges) {
        vs[x - 1].push(y);
        vs[y - 1].push(x);
        tree.link(x, y);
    }
});

sd.main(async () => {
    await dfs(1, 0);
});

async function dfs(x, f) {
    await sd.pause();
    focus.startAnimate().focus(x).endAnimate();
    for (let i = 0; i < vs[x - 1].length(); i++) {
        await sd.pause();
        vs[x - 1].startAnimate();
        if (i > 0) vs[x - 1].color(i - 1, C.white);
        vs[x - 1].color(i, C.blue);
        vs[x - 1].endAnimate();
        const v = vs[x - 1].intValue(i);
        if (+v !== +f) await dfs(v, x);
        await sd.pause();
        focus.startAnimate().focus(x).endAnimate();
    }
    await sd.pause();
    vs[x - 1].startAnimate().color(C.white).endAnimate();
}
