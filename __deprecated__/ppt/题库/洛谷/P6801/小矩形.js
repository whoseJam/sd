import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg);
const data = [3, 3, 3, 3, 3];

sd.init(() => {
    grid.axis("col").align("my");
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i]; j++) {
            grid.insert(i, j);
        }
    }
})

sd.main(async () => {
    const top = new sd.Line(svg).source(-20, 0).target(220, 0).stroke(C.red).strokeWidth(2).strokeDashArray([5, 5]);
    const left = new sd.Line(svg).source(0, -20).target(0, 140).stroke(C.red).strokeWidth(2).strokeDashArray([5, 5]);
    const right = new sd.Line(svg).source(200, -20).target(200, 140).stroke(C.red).strokeWidth(2).strokeDashArray([5, 5]);
    const bottom = new sd.Line(svg).source(-20, 120).target(220, 120).stroke(C.red).strokeWidth(2).strokeDashArray([5, 5]);
})