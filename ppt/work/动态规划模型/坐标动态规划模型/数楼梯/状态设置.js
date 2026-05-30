import * as sd from "@/sd";

const svg = sd.svg();
const n = 10;
const posI = 6;
const posJ = 4;
const arr = new sd.Array(svg).resize(n);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(arr, "i").startAnimate().moveTo(posI).endAnimate();
    await sd.pause();
    sd.Pointer(arr, "i-1")
        .startAnimate()
        .moveTo(posI - 1)
        .endAnimate();
    sd.Pointer(arr, "i-2")
        .startAnimate()
        .moveTo(posI - 2)
        .endAnimate();
    await sd.pause();
    sd.Link(arr.element(posI - 1), arr.element(posI), sd.Curve, "cx", "my", "cx", "my")
        .bending(0.3)
        .startAnimate()
        .pointStoT()
        .endAnimate()
        .arrow();
    sd.Link(arr.element(posI - 2), arr.element(posI), sd.Curve, "cx", "my", "cx", "my")
        .bending(0.3)
        .startAnimate()
        .pointStoT()
        .endAnimate()
        .arrow();
});
