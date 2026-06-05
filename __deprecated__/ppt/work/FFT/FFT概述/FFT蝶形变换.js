import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const EN = sd.enter();
const n = 8;
const logN = 3;
const arr = new sd.ValueArray(svg);
const rev = sd.make1d(100);
let id = 0;

sd.init(() => {
    for (let i = 0; i < n; i++) {
        rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (logN - 1));
        const box = new sd.Box(arr).value(new sd.Math(arr, `a_{${i}}`), R.center());
        arr.push(box);
        box.position = i;
        box.rank = rev[i];
    }
});

sd.main(async () => {
    await sd.pause();
    arr.startAnimate()
        .sort((a, b) => a.rank - b.rank)
        .endAnimate();
    await sd.pause();
    const cx = arr.cx();
    arr.startAnimate().elementWidth(60).cx(cx).endAnimate();
    const dx = (arr.elementWidth() - 40) / 2;

    await sd.pause();
    for (let i = 0; i < n; i++) {
        const box = arr.element(i);
        box.value().startAnimate().transformMath(`y^{\\small(${0}\\small)}_{${box.position}}`).endAnimate();
    }
    for (let i = 1; i < n; i <<= 1) {
        for (let j = 0; j < n; j += i * 2) {
            await sd.pause();
            const tmp = new sd.Array(svg).resize(i * 2).start(j);
            tmp.my(arr.y() - 60).cx((arr.element(j).x() + arr.element(j + 2 * i - 1).mx()) / 2);
            tmp.opacity(0).startAnimate().opacity(1).endAnimate();
            for (let k = 0; k < i; k++) {
                await sd.pause();
                sd.Link(arr.element(j + k), tmp.element(j + k), sd.Line, "cx", "y", "cx", "my")
                    .startAnimate()
                    .pointStoT()
                    .endAnimate()
                    .arrow();
                sd.Link(arr.element(i + j + k), tmp.element(j + k), sd.Line, "cx", "y", "cx", "my")
                    .startAnimate()
                    .pointStoT()
                    .endAnimate()
                    .arrow();
                sd.Link(arr.element(j + k), tmp.element(i + j + k), sd.Line, "cx", "y", "cx", "my")
                    .startAnimate()
                    .pointStoT()
                    .endAnimate()
                    .arrow();
                sd.Link(arr.element(i + j + k), tmp.element(i + j + k), sd.Line, "cx", "y", "cx", "my")
                    .startAnimate()
                    .pointStoT()
                    .endAnimate()
                    .arrow();
                await sd.pause();
                const box1 = arr.element(j + k);
                const box2 = arr.element(i + j + k);
                box1.value()
                    .startAnimate()
                    .transformMath(`y^{\\small(${Math.log2(i) + 1}\\small)}_{${box1.position}}`)
                    .endAnimate();
                box2.value()
                    .startAnimate()
                    .transformMath(`y^{\\small(${Math.log2(i) + 1}\\small)}_{${box2.position}}`)
                    .endAnimate();
            }
            await sd.pause();
            tmp.startAnimate().dy(60).opacity(0).endAnimate();
            for (let k = 0; k < i; k++) {
                arr.element(j + k)
                    .startAnimate()
                    .dx(dx * i)
                    .endAnimate();
                arr.element(i + j + k)
                    .startAnimate()
                    .dx(-dx * i)
                    .endAnimate();
            }
        }
    }
});
