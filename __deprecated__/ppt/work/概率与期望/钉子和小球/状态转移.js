import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const grid = new sd.Grid(svg).startN(1).startM(1);
const posI = 3;
const posJ = 2;
const n = 5;

sd.init(() => {
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= i; j++) {
            grid.insert(i, j);
        }
    grid.forEachElement((element, i, j) => {
        element.dx((n - i) * 0.5 * 40);
    });
});

sd.main(async () => {
    await sd.pause();
    new sd.Curve(svg)
        .source(grid.element(1, 1).center())
        .target(grid.element(posI, posJ).center())
        .startAnimate()
        .pointStoT()
        .value("$f_{i,j}$", R.pointAtPathByRate(0.5, "mx", "cy", 0 - 10))
        .endAnimate()
        .arrow();
    await sd.pause();
    new sd.Line(svg)
        .source(grid.element(posI, posJ).center())
        .target(grid.element(posI + 1, posJ).center())
        .startAnimate()
        .pointStoT()
        .endAnimate()
        .arrow();
    new sd.Line(svg)
        .source(grid.element(posI, posJ).center())
        .target(grid.element(posI + 1, posJ + 1).center())
        .startAnimate()
        .pointStoT()
        .endAnimate()
        .arrow();
    await sd.pause();
    new sd.Curve(svg)
        .source(grid.element(posI, posJ).center())
        .target(grid.element(posI + 2, posJ + 1).center())
        .bending(-0.2)
        .startAnimate()
        .pointStoT()
        .endAnimate()
        .arrow();
});
