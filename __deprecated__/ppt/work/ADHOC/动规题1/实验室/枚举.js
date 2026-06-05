import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 6;
const m = 13;
const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);
const k = 7;
let length = Infinity;
let cx = 2;
let cy = 2;

sd.init(() => {
    for (let i = 1; i <= k; i++) {
        const x = Math.ceil(k / i);
        length = Math.min(length, (i + x) * 2);
    }
});

sd.main(async () => {
    for (let i = 1; i <= k; i++) {
        const x = Math.ceil(k / i);
        if (length === (i + x) * 2) {
            await sd.pause();
            draw(cx, cy, cx + i - 1, cy + x - 1);
            cy += x + 1;
        }
    }
});

function draw(x1, y1, x2, y2) {
    let current = k;
    grid.startAnimate();
    for (let i = x1; i <= x2; i++) {
        for (let j = y1; j <= y2; j++) {
            console.log(i, j, x1, y1, x2, y2);
            if (current > 0) grid.color(i, j, C.grey);
            current--;
        }
    }
    grid.endAnimate();
    sd.Focus(grid).startAnimate().focus(x1, y1, x2, y2).endAnimate();
}
