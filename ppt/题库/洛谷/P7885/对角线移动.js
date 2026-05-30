import * as sd from "@/sd";

const svg = sd.svg();
const n = 5;
const m = 10;
const dist = 3;
const start = [2, 4];
const target = [start[0] + dist, start[1] + dist];
const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);

sd.init(() => {
    grid.value(start[0], start[1], new sd.Math(svg, "(a,b)"));
    grid.value(target[0], target[1], new sd.Math(svg, "(c,d)"));
});

sd.main(async () => {});
