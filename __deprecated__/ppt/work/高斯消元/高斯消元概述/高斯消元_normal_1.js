import { Gauss } from "./高斯消元组件";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const R = sd.rule();
const n = 3;
const m = 3;
const grid = new sd.Grid(svg).x(400).y(100).elementWidth(60).elementHeight(60).n(m).m(n + 1);

const A = I.readIntMatrix(`
1 2 4 -1
2 3 7 2
2 1 3 7`, m, n + 1);

sd.main(async () => {
    await Gauss(grid, A, n, m);
})