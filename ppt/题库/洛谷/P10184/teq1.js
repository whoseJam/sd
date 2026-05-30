import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const A = [0, 3, 2, 5, 1, 1];
const n = 5;
const T = 1;
let cur = 0,
    ccur = 0;
const colorList = [];
for (let i = 1; i <= 20; i++) colorList.push(C.rand());

const arr = new sd.ValueArray(svg).elementWidth(60).align("y");

function nextColor() {
    if (cur + 1 > T) return colorList[ccur + 1];
    return colorList[ccur];
}

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        const stk = new sd.Stack(arr);
        for (let j = 1; j <= A[i]; j++) {
            stk.push(" ");
            let colored = false;
            stk.element(j - 1).onClick(() => {
                if (colored) return;
                colored = true;
                sd.inter(async () => {
                    for (let k = 0; k < A[i]; k++) {
                        if (stk.color(k).main == nextColor()) return;
                    }
                    if (++cur > T) ccur++, (cur = 1);
                    stk.startAnimate()
                        .color(j - 1, colorList[ccur])
                        .endAnimate();
                });
            });
        }
        arr.push(stk);
        sd.MathLabel(stk, `a_{${i}}`, "tc", 14);
    }
});

sd.main(async () => {});
