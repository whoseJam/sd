import { Gauss } from "./高斯消元组件";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const R = sd.rule();
const n = 4;
const m = 4;
const grid = new sd.Grid(svg).x(400).y(100).elementWidth(60).elementHeight(60).n(m).m(n + 1);

const A = I.readIntMatrix(`
1 2 1 -1 6
2 -1 2 1 -1
4 3 4 -1 15
1 2 1 3 5`, m, n + 1);

sd.main(async () => {
    await Gauss(grid, A, n, m);
})