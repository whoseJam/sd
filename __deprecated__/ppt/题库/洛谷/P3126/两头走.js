import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const D = sd.device();
const n = 4;
const data = I.readCharMatrix(
    `
ABCD
BXZX
CDXB
WCBA
    `,
    n,
    n,
    false
);
const grid = new sd.Grid(svg);
let [sx, sy] = [0, 0];
let [ex, ey] = [n - 1, n - 1];

D.onKeyDown("s", () => {
    sd.inter(async () => {
        if (sx + 1 < n) sx++;
        await update(sx, sy);
    });
});

D.onKeyDown("d", () => {
    sd.inter(async () => {
        if (sy + 1 < n) sy++;
        await update(sx, sy);
    });
});

D.onKeyDown("a", () => {
    sd.inter(async () => {
        if (ey - 1 >= 0) ey--;
        await update(ex, ey);
    });
});

D.onKeyDown("w", () => {
    sd.inter(async () => {
        if (ex - 1 >= 0) ex--;
        await update(ex, ey);
    });
});

sd.init(() => {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            grid.insert(i, j, data[i][j]);
        }
    }
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_STAGE);
    grid.startAnimate().color(sx, sy, C.blue).color(ex, ey, C.blue).endAnimate();
});

async function update(x, y) {
    grid.startAnimate().color(x, y, C.blue).endAnimate();
}
