import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 4;
const m = 6;
const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1).elementWidth(50).elementHeight(50);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            grid.element(i, j).value(new sd.Math(grid, `a_{${i},${j}}`), R.center());
        }
    }
});

sd.main(async () => {
    const pi = sd.Pointer(grid, "i", "r", 5, 20);
    const pj = sd.Pointer(grid, "j", "b", 5, 20);
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        grid.startAnimate();
        pi.moveTo(i, 1);
        for (let j = 1; j <= m; j++) {
            if (i > 1) grid.color(i - 1, j, C.white);
            grid.color(i, j, C.blue);
        }
        grid.endAnimate();
    }
    await sd.pause();
    grid.startAnimate();
    pi.moveTo(null);
    grid.color(C.white);
    grid.endAnimate();

    for (let j = 1; j <= m; j++) {
        await sd.pause();
        grid.startAnimate();
        pj.moveTo(1, j);
        for (let i = 1; i <= n; i++) {
            if (j > 1) grid.color(i, j - 1, C.white);
            grid.color(i, j, C.blue);
        }
        grid.endAnimate();
    }
    await sd.pause();
    grid.startAnimate();
    pj.moveTo(null);
    grid.color(C.white);
    grid.endAnimate();
});
