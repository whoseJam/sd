import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const grid = makeTriGrid(svg, n);
const posI = 4;
const posJ = 2;

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(grid, "i", "r").startAnimate().moveTo(posI, 1).endAnimate();
    sd.Pointer(grid, "j", "t").startAnimate().moveTo(n, posJ).endAnimate();
    grid.startAnimate().color(posI, posJ, C.blue).endAnimate();
    await sd.pause();
    new sd.Line(svg)
        .source(grid.element(1, 1).center())
        .target(grid.element(posI - 1, posJ).center())
        .startAnimate()
        .pointStoT()
        .endAnimate()
        .arrow();
    new sd.Line(svg)
        .source(grid.element(1, 1).center())
        .target(grid.element(posI - 1, posJ - 1).center())
        .startAnimate()
        .pointStoT()
        .endAnimate()
        .arrow();
    await sd.pause();
    new sd.Line(svg)
        .source(grid.element(posI - 1, posJ).center())
        .target(grid.element(posI, posJ).center())
        .startAnimate()
        .pointStoT()
        .endAnimate()
        .arrow();
    new sd.Line(svg)
        .source(grid.element(posI - 1, posJ - 1).center())
        .target(grid.element(posI, posJ).center())
        .startAnimate()
        .pointStoT()
        .endAnimate()
        .arrow();
});

function makeTriGrid(svg, n) {
    const tri = new sd.Grid(svg).startN(1).startM(1);
    for (let i = 1; i <= n; i++) tri.pushPrimary(i);
    return tri;
}
