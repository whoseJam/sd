import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 8;
const m = 10;
const x = 4;
const y = 6;
const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);
const colorMap = [
    [C.green, C.blue, C.deepSkyBlue],
    [C.grey, C.white, C.purple],
    [C.orange, C.yellow, C.coral]
];
const rect = new sd.Rect(svg).color(C.blue).width(20).height(20).drag(true);
rect.center(grid.element(x, y).center());

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            grid.color(i, j, colorMap
                [(i < x) ? 0 : (i === x) ? 1 : 2]
                [(j < y) ? 0 : (j === y) ? 1 : 2]);
        }
    }
    sd.Pointer(grid, "x", "r").moveTo(x, 1);
    sd.Pointer(grid, "y", "t").moveTo(n, y);
})

sd.main(async () => {
    sd.Focus(grid).focus(1, 1).drag(true);
})