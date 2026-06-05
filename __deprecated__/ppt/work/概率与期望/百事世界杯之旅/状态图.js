import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const n = 8;
const arr = new sd.ValueArray(svg).elementWidth(80);

sd.init(() => {
    for (let i = 0; i <= n; i++) arr.push(new sd.Box(arr).width(60).value(i));
    for (let i = 0; i < n; i++) {
        const current = arr.element(i);
        const next = arr.element(i + 1);
        const c2c = new sd.CircleCurve(svg).arrow();
        c2c.source([current.kx(0.7), current.my()]);
        c2c.target([current.kx(0.3), current.my()]);
        c2c.value(new sd.Math(c2c, `\\frac{${i}}{${n}}`).fontSize(10), R.pointAtPathByRate(0.5, "cx", "y", 0, 3));
        const c2n = sd.Link(current, next, sd.Curve).bending(-0.5).arrow();
        c2n.value(new sd.Math(c2n, `\\frac{${n - i}}{${n}}`).fontSize(10), R.pointAtPathByRate(0.5, "cx", "my", 0, -3));
    }
});

sd.main(async () => {});
