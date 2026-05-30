import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();
const R = sd.rule();
const t = new sd.Tree(svg).width(1100).cx(600).y(100);
const grid = new sd.Grid(svg).elementWidth(50);
const maxLength = new sd.Text(svg, "1");
const slider = new sd.Slider(svg)
    .width(300)
    .min(1)
    .max(20)
    .value(1)
    .x(t.cx())
    .my(t.y() - 30)
    .onChange(value => {
        sd.inter(async () => {
            await update(value);
        });
    });
sd.Aside(slider, maxLength, "rc");
const n = 20;
const pathes = [
    [16, 6, C.red],
    [8, 3, C.textBlue],
    [6, 7, C.purple],
    [3, 6, C.orange],
];
const dist = sd.make1d(n + 5);
const edges = [
    [1, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
    [4, 7],
    [4, 8],
    [5, 9],
    [5, 10],
    [6, 11],
    [7, 12],
    [8, 13],
    [8, 14],
    [8, 15],
    [10, 16],
    [12, 17],
    [14, 18],
    [15, 19],
    [15, 20],
];
t.root(1);
for (let i = 0; i < edges.length; i++) {
    t.link(edges[i][0], edges[i][1]);
    const l = t.element(edges[i][0], edges[i][1]);
    l.value(sd.rand(1, 5), R.pointAtPathByRate(0.5, "x", "cy"));
}

function dfs(u) {
    const children = t.children(u);
    for (const child of children) {
        const v = +t.nodeId(child);
        dist[v] = dist[u] + t.element(u, v).intValue();
        dfs(v);
    }
}

function distance(a, b) {
    let ans = 0;
    ans += dist[a];
    ans += dist[b];
    const g = t.lcaId(a, b);
    ans -= dist[g] * 2;
    return ans;
}

sd.init(() => {
    dfs(1);
    sd.Label(slider, "maxLength");
    pathes.forEach((path, i) => {
        const [a, b, color] = path;
        makePath(a, b, color);
        grid.insert(i, 0, new sd.Line(svg).strokeWidth(3).target(40, 0).color(color));
        grid.insert(i, 1, distance(a, b));
    });
    grid.x(t.mx()).cy(t.cy());
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_STAGE);
    await update(1);
});

function makePath(a, b, color) {
    const l = new sd.Curve(svg).color(color);
    const A = t.element(a);
    const B = t.element(b);
    l.source(A.cx(), A.cy()).target(B.cx(), B.cy()).arrow();
    sd.trim(l, A, B);
}

async function update(value) {
    maxLength.startAnimate().text(value).endAnimate();
    grid.startAnimate();
    for (let i = 0; i < grid.n(); i++) {
        if (grid.intValue(i, 1) > value) grid.color(i, 0, C.grey).color(i, 1, C.grey);
        else grid.color(i, 0, C.white).color(i, 1, C.white);
    }
    grid.endAnimate();
}
