import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const larr = new sd.Array(svg).resize(n).start(1);
const arr = new sd.Array(svg).resize(n).start(1);

sd.init(() => {
    sd.Label(larr, "l端点位于");
    sd.Label(larr, "的f(?,r)的值", "rc")
    arr.y(larr.my() + 40);
    sd.Label(arr, "比赛道路")
    sd.Index(larr, "t");
})

sd.main(async () => {
    const p = sd.Pointer(arr, "r", "t", 10, 20);
    for (let i = 1; i <= n; i++) {
        await sd.pause();
        p.startAnimate().moveTo(i).endAnimate();
        if (i === 6) arr.startAnimate().color(i, C.red).endAnimate();
        if (i === 6) {
            await sd.pause();
            const b = new sd.BraceCurve(svg);
            function brace(arr, l, r) {
                b.source(arr.element(l).x(), arr.y() - 5);
                b.target(arr.element(r).mx(), arr.y() - 5);
            }
            brace(arr, 4, 6);
            b.startAnimate().pointTtoS().endAnimate();
        }
    }
})