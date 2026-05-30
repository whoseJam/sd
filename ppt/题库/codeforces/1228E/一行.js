import * as sd from "@/sd";

const svg = sd.svg();
const n = 6;
const grid = new sd.Grid(svg).n(1).m(n).startN(1).startM(1);

sd.init(() => {
    sd.Brace(grid).brace(grid.element(1, 1), grid.element(1, n)).value("n");
});

sd.main(async () => {});
