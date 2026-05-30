import * as sd from "@/sd";

const svg = sd.svg();
const n = 5;
const m = 5;
const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);

sd.init(() => {
    for (let i = 1; i <= n; i++) sd.MathLabel(grid.element(i, 1), `X^{${n - i}}`, "lc").fontSize(15);
    for (let j = 1; j <= m; j++) sd.MathLabel(grid.element(1, j), `Y^{${m - j}}`, "tc").fontSize(15);
});

sd.main(async () => {});
