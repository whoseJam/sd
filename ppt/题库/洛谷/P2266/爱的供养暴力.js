import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
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

sd.init(() => {
    sd.Label(grid, "T=6  x=1  y=1", "tc");
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            grid.value(i, j, data[i][j]);
            let tmp = 0;
            grid.element(i, j).onClick(() => {
                if (tmp === 0) grid.color(i, j, C.blue);
                else grid.color(i, j, C.white);
                tmp ^= 1;
            });
        }
    }
});

sd.main(async () => {});
