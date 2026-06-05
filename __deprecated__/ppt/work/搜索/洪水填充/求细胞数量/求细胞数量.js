import * as sd from "@/sd";

const svg = sd.svg();
const I = sd.input();
const C = sd.color();
const n = 4;
const m = 10;
const data = I.readCharMatrix(
    `
0234500067
1034560500
2045600671
0000000089`,
    n,
    m
);
const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);
const vis = sd.make2d(20, 20);

sd.init(() => {
    for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) grid.value(i, j, data[i][j]);
});

sd.main(async () => {
    await sd.pause();
    const focus = sd.Focus(grid);
    let t = 0;
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            await sd.pause();
            focus.startAnimate().focus(i, j).endAnimate();
            if (data[i][j] == "0" || vis[i][j]) continue;
            await sd.pause();
            dfs(i, j, C.random());
        }
    }
});

function dfs(x, y, col) {
    vis[x][y] = 1;
    grid.startAnimate().color(x, y, col).endAnimate();
    const dx = [1, 0, -1, 0];
    const dy = [0, 1, 0, -1];
    for (let i = 0; i < 4; i++) {
        const tx = x + dx[i];
        const ty = y + dy[i];
        if (1 <= tx && tx <= n && 1 <= ty && ty <= m && data[tx][ty] != "0") {
            if (!vis[tx][ty]) {
                dfs(tx, ty, col);
            }
        }
    }
}
