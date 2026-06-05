import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 12;
const posI = 5;
const arr = new sd.Array(svg).resize(n).start(1);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(arr, "i").startAnimate().moveTo(posI).endAnimate();
    await sd.pause();
    arr.startAnimate().value(posI, "h").color(posI, C.grey).endAnimate();
    await sd.pause();
    const brace = sd
        .Brace(arr, "b")
        .brace(1, posI - 1)
        .startAnimate()
        .pointTtoS()
        .value("i-1")
        .endAnimate();
    await sd.pause();
    arr.startAnimate()
        .color(1, posI - 1, C.grey)
        .endAnimate();
    await sd.pause();
    arr.startAnimate().color(C.grey).endAnimate();
});
