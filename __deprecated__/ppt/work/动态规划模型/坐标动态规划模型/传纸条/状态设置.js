import * as sd from "@/sd";

const svg = sd.svg();
const grid = new sd.Grid(svg).n(5).m(5).startN(1).startM(1);
const [x1, y1] = [3, 3];
const [x2, y2] = [2, 4];

sd.init(() => {
    sd.Index(grid, "l");
    sd.Index(grid, "t");
});

sd.main(async () => {
    await sd.pause();
    const m1 = new sd.Math(svg, "x_1,y_1").fontSize(10).center(grid.element(x1, y1).center()).opacity(0).startAnimate().opacity(1).endAnimate();
    const m2 = new sd.Math(svg, "x_2,y_2").fontSize(10).center(grid.element(x2, y2).center()).opacity(0).startAnimate().opacity(1).endAnimate();
    new sd.Curve(svg).source(grid.element(1, 1).center()).target(m1.pos("x", "cy")).startAnimate().pointStoT().endAnimate().arrow();
    new sd.Curve(svg).source(grid.element(1, 1).center()).target(m2.pos("cx", "y")).bending(-0.2).startAnimate().pointStoT().endAnimate().arrow();
});
