import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const V = sd.vec();
const n = 5;
const grid = new sd.Grid(svg).n(n).m(n);

sd.init(() => {
    const line = new sd.Line(svg);
    line.source(V.add(grid.pos("x", "my"), [-20, 20]));
    line.target(V.add(grid.pos("mx", "y"), [20, -20]));
    line.stroke(C.red).strokeWidth(2);
})

sd.main(async () => {
    
})