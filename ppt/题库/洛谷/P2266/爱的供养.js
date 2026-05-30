import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const R = sd.rule();
const n = 3;
const m = 5;
const data = I.readIntMatrix(
    `
20 21 20 20 21
19 22 20 60 80
80 90 80 70 90`,
    n,
    m
);
const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);
const D = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
];
const links = [];
const fa = sd.make2d(10, 10, 0);
const focus = [
    [1, 1],
    [3, 1],
    [3, 5],
];

sd.init(() => {
    sd.Label(grid, "T=5", "tc");
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            fa[(i - 1) * m + j] = (i - 1) * m + j;
            grid.element(i, j).value(data[i][j], R.center());
            for (let k = 0; k < 4; k++) {
                const ni = i + D[k][0];
                const nj = j + D[k][1];
                if (ni > 0 && ni <= n && nj > 0 && nj <= m) {
                    const d = Math.abs(data[i][j] - data[ni][nj]);
                    links.push({
                        x1: i,
                        y1: j,
                        x2: ni,
                        y2: nj,
                        v: d,
                    });
                }
            }
        }
    }
    focus.forEach(f => {
        sd.Focus(grid).focus(f[0], f[1]);
    });
});

sd.main(async () => {
    const sortedLinks = links.sort((a, b) => a.v - b.v);
    for (let i = 0; i < sortedLinks.length; i++) {
        const link = sortedLinks[i];
        if (Merge(link.x1, link.y1, link.x2, link.y2)) {
            const t1 = grid.value(link.x1, link.y1);
            const t2 = grid.value(link.x2, link.y2);
            await sd.pause();
            sd.Link(t1, t2).stroke(C.red).strokeWidth(4).opacity(0).startAnimate().opacity(1).endAnimate();
        }
    }
});

function getFa(x) {
    if (fa[x] === x) return fa[x];
    return (fa[x] = getFa(fa[x]));
}

function Merge(x1, y1, x2, y2) {
    const id1 = (x1 - 1) * m + y1;
    const id2 = (x2 - 1) * m + y2;
    const fa1 = getFa(id1);
    const fa2 = getFa(id2);
    if (fa1 === fa2) return false;
    fa[fa1] = fa2;
    return true;
}
