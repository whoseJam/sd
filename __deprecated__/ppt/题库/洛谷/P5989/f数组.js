import * as sd from "@/sd";

const svg = sd.svg();
const n = 5;
const grid = new sd.Grid(svg).startN(1).startM(1);
const f = sd.make2d(10, 10);

sd.init(() => {
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= i; j++)
            grid.insert(i, j);
    grid.freeze();

    for (let i = 1; i <= n; i++) {
        const dx = (n - i) / 2 * 40;
        for (let j = 1; j <= i; j++) {
            grid.element(i, j).dx(dx);
        }
    }
})

sd.main(async () => {
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        grid.startAnimate();
        for (let j = 1; j <= i; j++) {
            let ans = f[i-1][j-1] + f[i-1][j] + 1;
            if (i - 2 >= 0) ans -= f[i-2][j-1];
            grid.value(i, j, f[i][j] = ans);
        }
        grid.endAnimate();
    }
})