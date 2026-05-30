import * as sd from "@/sd";

const svg = sd.svg();
const grid = new sd.Grid(svg);
const c = sd.make2d(20, 20);
const n = 5;

sd.init(() => {});

sd.main(async () => {
    c[0][0] = 1;
    grid.insert(0, 0, 1);
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        grid.startAnimate();
        for (let j = 0; j <= i; j++) {
            if (j === 0) c[i][j] = 1;
            else c[i][j] = c[i - 1][j - 1] + c[i - 1][j];
            grid.insert(i, j, c[i][j]);
        }
        grid.endAnimate();
    }
    await sd.pause();
    grid.startAnimate();
    grid.forEachElement((element, i, j) => {
        element.dx((n - i) * 0.5 * 40);
    });
    grid.endAnimate();
});
