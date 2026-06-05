import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 12;
const posI = 9;
const posP = 5;
const arr = new sd.Array(svg).resize(n).start(1);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(arr, "i").startAnimate().moveTo(posI).endAnimate();
    sd.Pointer(arr, "p").startAnimate().moveTo(posP).endAnimate();
    await sd.pause();
    arr.startAnimate().value(posI, "h").color(posI, C.grey).endAnimate();
    await sd.pause();
    const brace = sd
        .Brace(arr, "b")
        .brace(posP + 1, posI - 1)
        .startAnimate()
        .pointTtoS()
        .value("i-p-1")
        .endAnimate();
    await sd.pause();
    arr.startAnimate()
        .color(posP + 1, posI - 1, C.grey)
        .endAnimate();
    await sd.pause();
    arr.startAnimate().color(posP, C.grey).endAnimate();
    await sd.pause();
    brace.startAnimate().brace(posP, posI).text("i-p+1").endAnimate();
    await sd.pause();
    arr.startAnimate().color(C.grey).endAnimate();
});
