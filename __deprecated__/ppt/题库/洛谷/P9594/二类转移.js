import * as sd from "@/sd";

const svg = sd.svg();
const I = sd.input();
const C = sd.color();
const R = sd.rule();
const arr = new sd.Array(svg).resize(11).start(1);

sd.init(() => {
    brace(new sd.BraceCurve(svg), arr, 4, 8, false).value(new sd.Math(svg, "第k条线段(l_k,r_k,绿,w_k)"), R.pointAtPathByRate(0.5, "cx", "y"));
});

sd.main(async () => {
    await sd.pause();
    arr.startAnimate().color(4, 8, C.green).endAnimate();
    await sd.pause();
    brace(new sd.BraceCurve(svg), arr, 2, 10).startAnimate().pointStoT().endAnimate();
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
