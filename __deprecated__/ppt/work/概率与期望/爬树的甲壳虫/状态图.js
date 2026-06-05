import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const n = 8;
const arr = new sd.ValueArray(svg).elementWidth(80);

sd.init(() => {
    for (let i = 0; i <= n; i++) arr.push(new sd.Box(arr).width(60).value(i));
    for (let i = 1; i <= n; i++) {
        const current = arr.element(i);
        const prev = arr.element(i - 1);
        const root = arr.element(0);
        if (i < n) {
            const c2r = new sd.ZZLine(svg).location("b").bending(0.2).arrow();
            c2r.source([current.cx(), current.my()]);
            c2r.target([root.cx(), root.my()]);
            c2r.value(new sd.Math(c2r, `P_{${i + 1}}`).fontSize(10), R.pointAtPathByRate(0.5, "cx", "y", 0, 3));
        }
        const c2n = sd.Link(prev, current, sd.Curve).bending(-0.5).arrow();
        c2n.value(new sd.Math(c2n, `1-P_{${i}}`).fontSize(10), R.pointAtPathByRate(0.5, "cx", "my", 0, -3));
    }
    const root = arr.element(0);
    const c2r = new sd.CircleCurve(svg).revArrow();
    c2r.source([root.kx(0.3), root.y()]);
    c2r.target([root.kx(0.7), root.y()]);
    c2r.value(new sd.Math(c2r, `P_1`).fontSize(10), R.pointAtPathByRate(0.5, "cx", "my", 0, -3));
});

sd.main(async () => {});
