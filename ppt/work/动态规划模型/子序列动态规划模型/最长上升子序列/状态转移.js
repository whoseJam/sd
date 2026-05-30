import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const posI = 7;
const posJ = 4;
const arr = new sd.Array(svg).resize(n).start(1);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    const pI = sd.Pointer(arr, "i", "b", 3, 20, 3);
    const pJ = sd.Pointer(arr, "j", "b", 3, 20, 3);
    pI.startAnimate().moveTo(posI).endAnimate();
    arr.element(posI).startAnimate().color(C.blue).endAnimate();
    await sd.pause();
    pJ.startAnimate().moveTo(posJ).endAnimate();
    arr.element(posJ).startAnimate().color(C.blue).endAnimate();
});
