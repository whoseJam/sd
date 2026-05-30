import * as sd from "@/sd";

const svg = sd.svg();
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
const focus = sd.Focus(grid);
const path = new sd.Array(svg);
let [x, y] = [0, 0];

D.onKeyDown("s", () => {
    if (x + 1 < n) {
        x++;
        sd.inter(update);
    }
});

D.onKeyDown("d", () => {
    if (y + 1 < n) {
        y++;
        sd.inter(update);
    }
});

sd.init(() => {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            grid.insert(i, j, data[i][j]);
        }
    }
    path.y(200).x(grid.cx() - ((grid.m() + grid.n() - 1) / 2) * grid.elementWidth());
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_STAGE);
    await update();
});

async function update() {
    focus.startAnimate().focus(x, y).endAnimate();
    path.startAnimate().push(grid.text(x, y)).endAnimate();
}
