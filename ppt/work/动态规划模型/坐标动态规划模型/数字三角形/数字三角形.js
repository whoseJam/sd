import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const data = [[], [0, 7], [0, 3, 8], [0, 8, 1, 0], [0, 2, 7, 4, 4], [0, 4, 5, 2, 6, 5]];
const tri = makeTriGrid(svg, n);
const dp = makeTriGrid(svg, n);

sd.init(() => {
    sd.Label(dp, "从(1,1)到当前位置的最大价值", "bc");
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= i; j++) {
            tri.value(i, j, data[i][j]);
        }
    }
    tri.x(100).y(100);
    dp.x(600).y(100);
});

sd.main(async () => {
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= i; j++) {
            await sd.pause();
            dp.startAnimate().color(i, j, C.orange).endAnimate();

            await sd.pause();
            let v = 0;
            dp.startAnimate();
            if (i - 1 >= 1 && j - 1 >= 1) {
                dp.color(i - 1, j - 1, C.blue);
                v = Math.max(v, +dp.value(i - 1, j - 1).text());
            }
            if (i - 1 >= 1 && j < i) {
                dp.color(i - 1, j, C.blue);
                v = Math.max(v, +dp.value(i - 1, j).text());
            }
            dp.endAnimate();
            tri.startAnimate().color(i, j, C.blue).endAnimate();

            await sd.pause();
            dp.startAnimate()
                .value(i, j, v + data[i][j])
                .endAnimate();

            await sd.pause();
            dp.startAnimate().color(C.white).endAnimate();
            tri.startAnimate().color(C.white).endAnimate();
        }
    }
    await sd.pause();
});

function makeTriGrid(svg, n) {
    const tri = new sd.Grid(svg).startN(1).startM(1);
    for (let i = 1; i <= n; i++) tri.pushPrimary(i);
    return tri;
}
