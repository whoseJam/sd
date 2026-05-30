import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const m = 9;
const dx = [1, 1, 2, 2, -1, -1, -2, -2, 0];
const dy = [2, -2, 1, -1, 2, -2, 1, -1, 0];
const cx = 4;
const cy = 3;
const mp = new sd.Grid(svg).startN(1).startM(1).n(n).m(m);

sd.init(() => {
    sd.Label(mp, "从(1,1)到当前位置的路径数", "bc");
    for (let i = 0; i < 9; i++) {
        let tx = cx + dx[i];
        let ty = cy + dy[i];
        if (1 <= tx && tx <= n && 1 <= ty && ty <= m) mp.value(tx, ty, new sd.Circle(svg).color(C.ORANGE));
    }
    mp.cx(600).y(100);
});

sd.main(async () => {
    await sd.pause();
    mp.startAnimate().color(1, 1, C.blue).endAnimate();
    await sd.pause();
    mp.startAnimate().value(1, 1, 1).endAnimate();
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (mp.value(i, j)) continue;
            await sd.pause();
            mp.startAnimate();
            mp.color(i, j, C.orange);
            let ans = 0;
            if (i - 1 >= 1 && mp.value(i - 1, j).text) (ans += +mp.value(i - 1, j).text()), mp.color(i - 1, j, C.blue);
            if (j - 1 >= 1 && mp.value(i, j - 1).text) (ans += +mp.value(i, j - 1).text()), mp.color(i, j - 1, C.blue);
            mp.endAnimate();
            await sd.pause();
            mp.startAnimate().value(i, j, ans).endAnimate();
            await sd.pause();
            mp.startAnimate().color(C.white).endAnimate();
        }
    }
});
