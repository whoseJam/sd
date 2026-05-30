import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 6;
const grid = new sd.Grid(svg).n(n).m(n).startN(1).startM(1);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        for (let d = 1; d <= i; d++) {
            if (i % d === 0) grid.element(i, d).value(new sd.Math(grid, `${d}`), R.center());
        }
    }
});

sd.main(async () => {
    const pi = sd.Pointer(grid, "i", "r", 5, 20);
    const pj = sd.Pointer(grid, "d", "b", 5, 20);
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        grid.startAnimate();
        pi.moveTo(i, 1);
        grid.color(C.white);
        for (let d = 1; d <= i; d++) if (i % d === 0) grid.color(i, d, C.blue);
        grid.endAnimate();
    }
    await sd.pause();
    grid.startAnimate();
    pi.moveTo(null);
    grid.color(C.white);
    grid.endAnimate();

    for (let d = 1; d <= n; d++) {
        await sd.pause();
        grid.startAnimate();
        pj.moveTo(1, d);
        grid.color(C.white);
        for (let i = d; i <= n; i += d) grid.color(i, d, C.blue);
        grid.endAnimate();
    }
    await sd.pause();
    grid.startAnimate();
    pj.moveTo(null);
    grid.color(C.white);
    grid.endAnimate();
});
