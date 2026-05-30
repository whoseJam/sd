import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = `
.X....X..X
....X.....
.X.....X.X
..........
X.X.X.X..X`;
const I = sd.input();
const n = 5;
const m = 10;
const values = I.readCharMatrix(data, n, m, true);
const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);

sd.init(() => {
    grid.forEachElement((element, i, j) => {
        element.color(values[i][j] === "X" ? C.yellow : C.white);
        element.onClick(() => {
            if (element.color().fill === C.white) {
                sd.inter(async () => {
                    element.startAnimate().color(C.yellow).endAnimate();
                });
            }
        });
    });
});

sd.main(async () => {});
