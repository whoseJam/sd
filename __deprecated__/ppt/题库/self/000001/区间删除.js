import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const n = 10;
const l = 2;
const r = 6;
const arr = new sd.Array(svg).start(1).resize(n);

sd.init(() => {});

sd.main(async () => {
    function brace(arr, l, r, b, rev = false) {
        if (!rev) {
            b.source(arr.element(l).x(), arr.element(l).y() - 5);
            b.target(arr.element(r).mx(), arr.element(r).y() - 5);
        } else {
            b.target(arr.element(l).x(), arr.element(l).my() + 5);
            b.source(arr.element(r).mx(), arr.element(r).my() + 5);
        }
    }

    const b1 = new sd.BraceCurve(svg).opacity(0);
    const b2 = new sd.BraceCurve(svg).opacity(0);

    await sd.pause();
    brace(arr, 1, n, b2, true);
    b2.value(new sd.Math(b2, "tot_2,tot_5"), R.pointAtPathByRate(0.5, "cx", "y"));
    b2.startAnimate().opacity(1).endAnimate();

    await sd.pause();
    brace(arr, l, r, b1);
    b1.value(new sd.Math(b1, "cnt_2,cnt_5"), R.pointAtPathByRate(0.5, "cx", "my"));
    b1.startAnimate().opacity(1).endAnimate();
});
