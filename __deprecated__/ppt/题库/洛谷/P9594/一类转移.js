import * as sd from "@/sd";

const svg = sd.svg();
const I = sd.input();
const C = sd.color();
const R = sd.rule();
const arr = new sd.Array(svg).resize(10).start(1);

sd.init(() => {
    brace(new sd.BraceCurve(svg), arr, 5, 10, false).value(new sd.Math(svg, "第k条线段(l_k,r_k,绿,w_k)"), R.pointAtPathByRate(0.5, "cx", "y"));
});

sd.main(async () => {
    await sd.pause();
    arr.startAnimate().color(5, 10, C.green).endAnimate();
    await sd.pause();
    const b = brace(new sd.BraceCurve(svg), arr, 1, 6);
    b.value(new sd.Math(svg, "f(j,绿)"), R.pointAtPathByRate(0.5, "cx", "my"));
    b.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    b.startAnimate();
    brace(b, arr, 1, 4);
    b.endAnimate();
});

function brace(b, arr, l, r, flag = true) {
    if (flag) {
        b.source(arr.element(l).x(), arr.y() - 5);
        b.target(arr.element(r).mx(), arr.y() - 5);
    } else {
        b.target(arr.element(l).x(), arr.my() + 5);
        b.source(arr.element(r).mx(), arr.my() + 5);
    }
    return b;
}
