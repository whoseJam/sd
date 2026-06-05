import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const l = 2;
const r = 6;
const target = 8;
const arr = new sd.Array(svg).start(1).resize(n);

sd.init(() => {

})

sd.main(async () => {
    await sd.pause();
    arr.startAnimate().color(target, C.blue).endAnimate();
    await sd.pause();
    arr.startAnimate().color(l, r, C.green).endAnimate();
    for (let i = l; i <= r; i++) {
        sd.Link(arr.element(i), arr.element(target), sd.Curve, "cx", "y", "cx", "y", (line) => line.bending(-0.5)).startAnimate().pointStoT().endAnimate().arrow();
    }
})