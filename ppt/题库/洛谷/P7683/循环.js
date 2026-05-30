import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const grid = new sd.Grid(svg).n(n).m(n).startN(1).startM(1);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    grid.startAnimate().value(3, 3, new sd.Circle(svg).color(C.orange));
    await sd.pause();
    const pen = new sd.PathPen()
        .MoveTo(pos(3, 3))
        .LineTo(pos(2, 3))
        .LineTo(pos(2, 5))
        .LineTo(pos(1, 5))
        .LineTo(pos(1, 1))
        .LineTo(pos(5, 1))
        .LineTo(pos(5, 2))
        .LineTo(pos(4, 2))
        .LineTo(pos(4, 3))
        .LineTo(pos(3, 3));
    const path = new sd.Path(svg)
        .color(C.pureBlue)
        .d(pen.toString())
        .startAnimate(1200)
        .pointStoT()
        .endAnimate()
        .arrow();
});

function pos(i, j) {
    return grid.element(i, j).center();
}
