import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg);
const data = [1, 1, 2, 2, 2, 1, 1, 2, 2, 2];

sd.init(() => {
    grid.axis("col").align("my");
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i]; j++) {
            grid.insert(i, j);
        }
    }
    const brace = sd.Brace(grid).brace(grid.element(0, 0), grid.element(data.length - 1, 0), "b");
    brace.value(new sd.Math(brace, "\\sum_{i=1}^nw_i"));
});

sd.main(async () => {
    const top = new sd.Line(svg)
        .source(-20, 0)
        .target(data.length * 40 + 20, 0)
        .stroke(C.red)
        .strokeWidth(2)
        .strokeDashArray([5, 5]);
    const left = new sd.Line(svg).source(0, -20).target(0, 100).stroke(C.red).strokeWidth(2).strokeDashArray([5, 5]);
    const right = new sd.Line(svg)
        .source(data.length * 40, -20)
        .target(data.length * 40, 100)
        .stroke(C.red)
        .strokeWidth(2)
        .strokeDashArray([5, 5]);
    const bottom = new sd.Line(svg)
        .source(-20, 80)
        .target(data.length * 40 + 20, 80)
        .stroke(C.red)
        .strokeWidth(2)
        .strokeDashArray([5, 5]);
    await sd.pause();
    top.startAnimate().dy(40).endAnimate();
});
