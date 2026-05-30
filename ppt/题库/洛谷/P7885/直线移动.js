import * as sd from "@/sd";

const svg = sd.svg();
const n = 5;
const m = 10;
const dist = 5;
const start = [2, 3];
const target = [start[0], start[1] + dist];
const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);

sd.init(() => {
    grid.value(start[0], start[1], new sd.Math(svg, "(a,b)"));
    grid.value(target[0], target[1], new sd.Math(svg, "(c,d)"));
    grid.value(start[0] + 2, start[1], new sd.Math(svg, "(a,b)"));
    grid.value(target[0] + 2, target[1] + 1, new sd.Math(svg, "(c,d)"));
});

sd.main(async () => {});
