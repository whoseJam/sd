import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const grid = new sd.Grid(svg).n(5).m(5);
const c1 = new sd.Circle(grid).color(C.black).r(3).opacity(0);
const c2 = new sd.Circle(grid).color(C.black).r(3).opacity(0);
const c3 = new sd.Circle(grid).color(C.black).r(3).opacity(0);
const [x1, y1] = [1, 1];
const [x2, y2] = [1, 4];
const [x3, y3] = [3, 4];

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    c1.center(grid.element(x1, y1).center()).startAnimate().opacity(1).endAnimate();
    c2.center(grid.element(x2, y2).center()).startAnimate().opacity(1).endAnimate();
    c3.center(grid.element(x3, y3).center()).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    sd.Link(c1, c2).startAnimate().pointStoT().endAnimate();
    sd.Link(c2, c3).startAnimate().pointStoT().endAnimate();
    sd.Link(c3, c1).startAnimate().pointStoT().endAnimate();
});
