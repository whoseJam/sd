import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const D = sd.device();
const n = 6;
const [K, x1, x2] = [3, 2, n - 2];
const grid = new sd.Grid(svg).n(n).m(n).startN(1).startM(1);

sd.init(() => {
    sd.Label(grid, `k=${K}`, "bc");
});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(grid, "$x_1$", "r").startAnimate().moveTo(x1, 1).endAnimate();
    sd.Pointer(grid, "$x_2$", "r").startAnimate().moveTo(x2, 1).endAnimate();
    await sd.pause();

    // x1 - 1 + y1 - 1 = K
    sd.Pointer(grid, "$y_1$", "b")
        .startAnimate()
        .moveTo(1, K + 2 - x1)
        .endAnimate();
    // n - x2 + n - y2 = K
    sd.Pointer(grid, "$y_2$", "b")
        .startAnimate()
        .moveTo(1, n + n - K - x2)
        .endAnimate();
    grid.startAnimate();
    color(1, 1, x1, K + 2 - x1, C.blue);
    color(x2, n + n - K - x2, n, n, C.blue);
    grid.endAnimate();
});

function color(x1, y1, x2, y2, color) {
    for (let i = x1; i <= x2; i++) {
        for (let j = y1; j <= y2; j++) {
            grid.color(i, j, color);
        }
    }
}
