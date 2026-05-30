import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const D = sd.device();
const n = 20;
const arr = new sd.Array(svg).resize(n).start(1);
const B = 4;
const colorList = [C.gradient(C.white, C.deepSkyBlue, 0, 2)(1), C.deepSkyBlue];
const ranges = [sd.Brace(arr), sd.Brace(arr), sd.Brace(arr)];

let curI = 0;
let curJ = 0;

D.onKeyDown("s", () => {
    sd.inter(async () => {
        ranges.forEach((range, idx) => {
            const l = sd.rand(curI, Math.min(curI + B - 1, n));
            const r = sd.rand(curJ, Math.min(curJ + B - 1, n));
            range
                .startAnimate()
                .brace(l, r, "b", idx * 10 + 10)
                .endAnimate();
        });
        await sd.pause();
        ranges.forEach(range => {
            range.startAnimate().opacity(0).endAnimate();
        });
    });
});

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        const idx = Math.floor((i - 1) / B) & 1;
        arr.color(i, colorList[idx]);
    }
});

sd.main(async () => {
    const f1 = sd.Focus(arr);
    const f2 = sd.Focus(arr).stroke(C.orange);
    const b1 = sd.Brace(arr).value("l端点所在区间");
    const b2 = sd.Brace(arr).value("r端点所在区间");
    for (let i = 1; i <= n; i += B) {
        for (let j = i + B; j <= n; j += B) {
            if (i === 1 && j === i + B) await sd.pause(sd.CONTINUE_STAGE);
            else await sd.pause();
            curI = i;
            curJ = j;
            b1.startAnimate()
                .brace(i, Math.min(i + B - 1, n), "t")
                .endAnimate();
            b2.startAnimate()
                .brace(j, Math.min(j + B - 1, n), "t")
                .endAnimate();
            f1.startAnimate()
                .focus(i, Math.min(i + B - 1, n))
                .endAnimate();
            f2.startAnimate()
                .focus(j, Math.min(j + B - 1, n))
                .endAnimate();
        }
    }
});
