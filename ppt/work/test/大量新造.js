import * as sd from "@/sd";

const svg = sd.svg();
const grid = new sd.Grid(svg);
const n = 20;

sd.init(() => {
    sd.freeze();
    grid.n(n).m(n);
    sd.unfreeze();
});

sd.main(async () => {});
