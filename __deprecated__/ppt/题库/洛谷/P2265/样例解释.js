import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg);
const n = 4;
const m = 6;

sd.init(() => {
    grid.n(n + 1).m(m + 1);
    sd.Brace(grid, "l").brace(grid.element(0, 0), grid.element(n, 0)).value("n+1");
    sd.Brace(grid, "t").brace(grid.element(0, 0), grid.element(0, m)).value("m+1");
});

sd.main(async () => {
    await sd.pause();
    let result = [];
    for (let i = 1; i <= n; i++) result.push("up");
    for (let i = 1; i <= m; i++) result.push("right");
    for (let i = 1, lst; i < n + m; i++) {
        let tmp = result[(lst = sd.rand(0, i))];
        result[lst] = result[i];
        result[i] = tmp;
    }
    grid.startAnimate().color(n, 0, C.blue).endAnimate();

    let curx = n;
    let cury = 0;
    for (let i = 0; i < n + m; i++) {
        if (result[i] === "up") curx--;
        else cury++;
        grid.startAnimate().color(curx, cury, C.blue).endAnimate();
    }
});
