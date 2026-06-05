import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 4;
const grid = new sd.Grid(svg).n(n).m(n).startN(1).startM(1).elementWidth(50).elementHeight(50);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= i; j++) {
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
        grid.color(C.white);
        for (let j = 1; j <= i; j++) grid.color(i, j, C.blue);
        grid.endAnimate();
    }
    await sd.pause();
    grid.startAnimate();
    pi.moveTo(null);
    grid.color(C.white);
    grid.endAnimate();

    for (let j = 1; j <= n; j++) {
        await sd.pause();
        grid.startAnimate();
        pj.moveTo(1, j);
        grid.color(C.white);
        for (let i = j; i <= n; i++) grid.color(i, j, C.blue);
        grid.endAnimate();
    }
    await sd.pause();
    grid.startAnimate();
    pj.moveTo(null);
    grid.color(C.white);
    grid.endAnimate();
});
