import { Gauss } from "./高斯消元组件";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const R = sd.rule();
const n = 3;
const m = 5;
const grid = new sd.Grid(svg).x(400).y(100).elementWidth(50).elementHeight(50).n(m).m(n + 1);
const A = I.readIntMatrix(`
1 2 -4 5
2 1 -6 8
3 3 -10 13
4 -1 -12 13
6 0 -18 21`, m, n + 1);

sd.main(async () => {
    await Gauss(grid, A, n, m);
})