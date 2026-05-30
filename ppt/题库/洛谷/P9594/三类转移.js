import * as sd from "@/sd";

const svg = sd.svg();
const I = sd.input();
const C = sd.color();
const R = sd.rule();
const arr = new sd.Array(svg).resize(11).start(1);

sd.init(() => {
    brace(new sd.BraceCurve(svg), arr, 6, 10, false).value(new sd.Math(svg, "第k条线段(l_k,r_k,绿,w_k)"), R.pointAtPathByRate(0.5, "cx", "y"));
});

sd.main(async () => {
    await sd.pause();
    arr.startAnimate().color(6, 10, C.green).endAnimate();
    await sd.pause();
    const brace = sd.Brace(arr).value(new sd.Math(svg, "f(j,任意颜色)"));
    brace.startAnimate().brace(2, 4).endAnimate();
    await sd.pause();
    brace.startAnimate().brace(2, 5).endAnimate();
    await sd.pause();
    brace.startAnimate().brace(2, 6).endAnimate();
});

function brace(b, arr, l, r, flag = true, gap = 5) {
    if (flag) {
        b.source(arr.element(l).x(), arr.y() - gap);
        b.target(arr.element(r).mx(), arr.y() - gap);
    } else {
        b.target(arr.element(l).x(), arr.my() + gap);
        b.source(arr.element(r).mx(), arr.my() + gap);
    }
    return b;
}
