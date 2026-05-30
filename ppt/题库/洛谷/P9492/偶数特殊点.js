import * as sd from "@/sd";

const svg = sd.svg();
const arr = new sd.Array(svg).resize(8).start(1);
const p = sd.Pointer(arr).drag(true);

sd.init(() => {
    p.moveTo(arr.length() >> 1);
})

sd.main(async () => {
    await sd.pause();
    const Y = arr.my() + 5;
    const lf = new sd.Line(svg).source(arr.x() + 5, Y).target(arr.element(arr.length() >> 1).mx() - 5, Y);
    const lb = new sd.Line(svg).source(arr.element(arr.length() >> 1).mx() + 5, Y).target(arr.mx() - 5, Y);
    lf.startAnimate().pointStoT().endAnimate().arrow();
    lb.startAnimate().pointStoT().endAnimate().arrow();
})