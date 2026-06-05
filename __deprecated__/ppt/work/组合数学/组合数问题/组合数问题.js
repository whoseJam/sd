import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg);
const c = sd.make2d(20, 20);
const n = 5;
const k = 2;
sd.Label(grid, `k=${2}`, "lc", 25);

sd.init(() => {
    c[0][0] = 1;
    grid.insert(0, 0, 1);
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j <= i; j++) {
            if (j === 0) c[i][j] = 1;
            else c[i][j] = c[i - 1][j - 1] + c[i - 1][j];
            grid.insert(i, j, c[i][j]);
        }
    }
    const focus = sd.Focus(grid).clickable(false);
    grid.forEachElement((element, i, j) => {
        element.onClick(() => {
            sd.inter(async () => {
                focus.startAnimate().focus(0, 0, i, j).endAnimate();
            });
        });
    });
});

sd.main(async () => {
    await sd.pause();
    grid.startAnimate();
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= i; j++) {
            if (c[i][j] % k === 0) {
                grid.color(i, j, C.blue);
            }
        }
    }
    grid.endAnimate();
    await sd.pause();
    grid.startAnimate();
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= i; j++) {
            if (c[i][j] % k === 0) grid.text(i, j, 1);
            else grid.text(i, j, 0);
        }
    }
    grid.endAnimate();
});
