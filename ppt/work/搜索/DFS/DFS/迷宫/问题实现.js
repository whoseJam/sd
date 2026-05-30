import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const n = 5;
const [x, y] = [3, 3];
const grid = new sd.Grid(svg).n(n).m(n).startN(1).startM(1);
const data = I.readIntMatrix(
    `
    0 1 0 0 0
    0 0 0 0 1
    0 0 0 0 0
    0 0 1 0 0
    0 0 1 0 0`,
    n,
    n
);
const visited = I.readIntMatrix(
    `
    0 0 0 0 0
    1 1 0 0 0
    1 1 1 0 0
    1 1 0 0 0
    1 1 0 0 0`,
    n,
    n
);

sd.init(() => {
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++) {
            if (data[i][j]) grid.value(i, j, 1);
            if (visited[i][j]) grid.color(i, j, C.grey);
        }
    grid.value(x, y, new sd.Circle(svg).color(C.orange));
});

sd.main(async () => {
    await sd.pause();
    createAndColor(x, y, x + 1, y, C.red);
    createAndColor(x, y, x - 1, y, C.green);
    createAndColor(x, y, x, y + 1, C.green);
    createAndColor(x, y, x, y - 1, C.red);
});

function createAndColor(x, y, tx, ty, color) {
    const e1 = grid.element(x, y);
    const e2 = grid.element(tx, ty);
    new sd.Line(svg).color(color).source(e1.center()).target(e2.center()).startAnimate().pointStoT().endAnimate().arrow();
}
