import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const posI = 8;
const posJ = 3;
const arr = new sd.Array(svg).resize(n);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(arr, "i").startAnimate().moveTo(posI).endAnimate();
    await sd.pause();
    sd.Pointer(arr, "k").startAnimate().moveTo(posJ).endAnimate();
    await sd.pause();
    const element = arr.element(posJ);
    new sd.Line(svg)
        .source(element.mx(), element.y() - 20)
        .target(element.mx(), element.my() + 20)
        .stroke(C.red)
        .strokeWidth(3)
        .startAnimate()
        .pointStoT()
        .endAnimate();
    sd.Brace(arr, "b")
        .brace(posJ + 1, posI)
        .startAnimate()
        .pointTtoS()
        .value("digit(k+1,i)")
        .endAnimate();
});
