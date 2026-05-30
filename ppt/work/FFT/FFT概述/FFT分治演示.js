import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const EN = sd.enter();
const n = 8;
const arr = new sd.Array(svg).x(100).y(100).resize(n);
let id = 0;

sd.init(() => {
    for (let i = 0; i < n; i++) {
        arr.element(i).value(new sd.Math(arr, `a_{${i}}`), R.center());
        arr.value(i).rank = i;
    }
});

sd.main(async () => {
    await Solve(arr, 50);
});

async function Solve(arr, gap) {
    const myId = ++id;
    if (arr.length() === 1) {
        arr.value(0)
            .startAnimate()
            .transformMath(`y^{\\small(${myId}\\small)}_{${arr.value(0).rank}}`)
            .endAnimate();
        return;
    }

    await sd.pause();
    const n = arr.length();
    const f0 = new sd.Array(svg);
    const f1 = new sd.Array(svg);
    f0.x(arr.x() - gap).y(arr.my() + 40);
    f1.x(arr.cx() + gap).y(arr.my() + 40);

    for (let i = 0; i < n; i++) {
        const math = new sd.Math(svg, arr.value(i).math()).center(arr.value(i).center());
        math.rank = arr.value(i).rank;
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

    await Solve(f0, gap / 2);
    await Solve(f1, gap / 2);

    await sd.pause();
    const n2 = n / 2;
    for (let i = 0; i < n; i++) {
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
        arr.value(i)
            .after(300)
            .startAnimate()
            .transformMath(`y^{\\small(${myId}\\small)}_{${arr.value(i).rank}}`)
            .endAnimate();
    }
}
