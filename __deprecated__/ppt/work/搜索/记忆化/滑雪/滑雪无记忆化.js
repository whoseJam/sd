import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const R = sd.rule();
const n = 5;
const m = 5;
const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);
const data = I.readIntMatrix(
    `
1 2 3 4 5
16 17 18 19 6
15 24 25 20 7
14 23 22 21 8
13 12 11 10 9`,
    n,
    m
);
const grad = C.gradient(C.white, C.deepSkyBlue, 1, 25);
const focus = sd.Focus(grid);
const dx = [1, 0, -1, 0];
const dy = [0, 1, 0, -1];
const dis = sd.make2d(10, 10);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            grid.color(i, j, grad(data[i][j]));
            grid.element(i, j).value(new sd.Circle(grid).color(C.ORANGE), R.centerContentFit(2));
            grid.value(i, j).opacity(0);
        }
    }
    grid.cx(600).cy(300);
});

sd.main(async () => {
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (!dis[i][j]) {
                await dfs(i, j);
                await sd.pause();
                focus.startAnimate().focus(null).endAnimate();
            }
        }
    }
});

async function dfs(x, y) {
    await sd.pause();
    focus.startAnimate().focus(x, y).endAnimate();
    grid.value(x, y).startAnimate().opacity(1).endAnimate();
    let curDis = 1;
    for (let i = 0; i < 4; i++) {
        const tx = x + dx[i];
        const ty = y + dy[i];
        if (1 <= tx && tx <= n && 1 <= ty && ty <= m && data[x][y] > data[tx][ty]) {
            let dis = await dfs(tx, ty);
            curDis = Math.max(curDis, dis + 1);
            await sd.pause();
            focus.startAnimate().focus(x, y).endAnimate();
        }
    }
    await sd.pause();
    grid.value(x, y).startAnimate().opacity(0).endAnimate();
    return dis[x][y];
}
