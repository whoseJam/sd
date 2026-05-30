import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const n = 3;
const m = 6;
const [D, R] = [1, 2];
const data = I.readCharMatrix(
    `
    ...#..
    ..##..
    ..#...
    `,
    n,
    m
);
const grid1 = createGrid();

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    const grid2 = createGrid().startAnimate().dy(200).endAnimate();
    await sd.pause();
    sd.Label(grid1, "未用掉药水").opacity(0).startAnimate().opacity(1).endAnimate();
    sd.Label(grid2, "用掉药水").opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            const ni = i + D;
            const nj = j + R;
            if (1 <= ni && ni <= n && 1 <= nj && nj <= m) {
                if (data[i][j] === "#") continue;
                if (data[ni][nj] === "#") continue;
                const line = new sd.Line(svg);
                line.source(grid1.element(i, j).center());
                line.target(grid2.element(ni, nj).center());
                line.startAnimate().pointStoT().endAnimate().arrow();
            }
        }
    }
    await sd.pause();
    grid1.startAnimate().color(1, 1, C.green).endAnimate();
    await sd.pause();
    grid1.startAnimate().color(n, m, C.orange).endAnimate();
    grid2.startAnimate().color(n, m, C.orange).endAnimate();
});

function createGrid() {
    const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= m; j++) {
            if (data[i][j] === "#") grid.value(i, j, data[i][j]);
        }
    return grid;
}
