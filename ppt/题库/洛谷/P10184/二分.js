import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const A = [0, 5, 3, 2, 1, 1];
const n = 5;
const T = 4;
const colorList = [C.blue, C.green, C.red, C.orange, C.purple];

const arr = new sd.ValueArray(svg).elementWidth(60).align("y");
const slider = new sd.Slider(svg).min(2).max(4).value(2).x(-60);
let midValue = 2;

slider.onChange(value => {
    midValue = +value;
});

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        const stk = new sd.Stack(arr);
        for (let j = 1; j <= A[i]; j++) {
            stk.push(" ");
        }
        arr.push(stk);
        stk.color(colorList[i - 1]);
        sd.MathLabel(stk, `a_{${i}}`, "tc", 14);
    }
});

sd.main(async () => {
    await sd.pause();
    await erfen(midValue);
});

async function erfen(mid) {
    const grid = new sd.Grid(svg)
        .n(mid)
        .m(T)
        .x(arr.mx() + 60)
        .y(arr.y())
        .opacity(0);
    grid.startAnimate().opacity(1).endAnimate();
    new sd.BraceCurve(grid)
        .source(grid.x(), grid.y() - 5)
        .target(grid.mx(), grid.y() - 5)
        .value("T", R.pointAtPathByRate(0.5, "cx", "my"));
    new sd.BraceCurve(grid)
        .target(grid.x() - 5, grid.y())
        .source(grid.x() - 5, grid.my())
        .value("mid", R.pointAtPathByRate(0.5, "mx", "cy", -5));
    function createAndMove(i, j, ti, tj) {
        const x = arr
            .element(i - 1)
            .element(j - 1)
            .x();
        const y = arr
            .element(i - 1)
            .element(j - 1)
            .y();
        const rect = new sd.Rect(svg)
            .x(x)
            .y(y)
            .color(colorList[i - 1]);
        const tx = grid.element(tj - 1, ti - 1).x();
        const ty = grid.element(tj - 1, ti - 1).y();
        rect.startAnimate().x(tx).y(ty).endAnimate();
    }
    let X = 1;
    let Y = 0;
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        if (A[i] < mid) {
            for (let j = 1; j <= A[i]; j++) {
                X = Y === mid ? X + 1 : X;
                Y = Y === mid ? 1 : Y + 1;
                createAndMove(i, j, X, Y);
            }
        } else {
            X++;
            for (let j = 1; j <= mid; j++) {
                createAndMove(i, j, i, j);
            }
        }
    }
}
