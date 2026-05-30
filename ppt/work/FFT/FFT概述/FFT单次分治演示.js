import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const EN = sd.enter();
const n = 8;
const arr = new sd.Array(svg).resize(n);

sd.init(() => {
    for (let i = 0; i < n; i++) {
        arr.element(i).value(new sd.Math(arr, `a_{${i}}`), R.center());
    }
});

sd.main(async () => {
    await sd.pause();
    const f0 = new sd.Array(svg);
    const f1 = new sd.Array(svg);
    f0.x(arr.x() - 20).y(arr.my() + 40);
    f1.x(arr.cx() + 20).y(arr.my() + 40);

    for (let i = 0; i < n; i++) {
        const math = new sd.Math(svg, arr.value(i).math()).center(arr.value(i).center());
        if (!(i & 1)) {
            f0.startAnimate();
            f0.push();
            f0.lastElement().value(math.onEnter(EN.moveTo()), R.center());
            f0.endAnimate();
        } else {
            f1.startAnimate();
            f1.push();
            f1.lastElement().value(math.onEnter(EN.moveTo()), R.center());
            f1.endAnimate();
        }
    }

    await sd.pause();
    for (let i = 0; i < n / 2; i++) {
        f0.value(i)
            .startAnimate()
            .transformMath(`y^{\\small(1\\small)}_{${i * 2}}`)
            .endAnimate();
        f1.value(i)
            .startAnimate()
            .transformMath(`y^{\\small(2\\small)}_{${i * 2 + 1}}`)
            .endAnimate();
    }

    const n2 = n / 2;
    for (let i = 0; i < n; i++) {
        await sd.pause();
        sd.Link(f0.element(i % n2), arr.element(i), sd.Line, "cx", "y", "cx", "my")
            .startAnimate()
            .pointStoT()
            .endAnimate()
            .arrow();
        sd.Link(f1.element(i % n2), arr.element(i), sd.Line, "cx", "y", "cx", "my")
            .startAnimate()
            .pointStoT()
            .endAnimate()
            .arrow();
        arr.value(i).after(300).startAnimate().transformMath(`y_{${i}}`);
    }
});
