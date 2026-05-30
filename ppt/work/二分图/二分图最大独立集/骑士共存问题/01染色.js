import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const grid = new sd.Grid(svg).startN(1).startM(1).n(n).m(n);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if ((i + j) & 1) {
                grid.color(i, j, C.grey);
            }
        }
    }
})

sd.main(async () => {
    
})