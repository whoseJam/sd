import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const i = 7;
const j = 4;
const arr = new sd.Array(svg).resize(n).start(1);

sd.init(() => {
    sd.Pointer(arr, "f(i)", "b", 3, 20, 3).moveTo(i);
    sd.Brace(arr).brace(1, i, "b").value("合法");
    arr.color(i, C.blue);
})

sd.main(async () => {
    await sd.pause();
    sd.Pointer(arr, "f(j)", "b", 3, 20, 3).startAnimate().moveTo(j).endAnimate();
    arr.startAnimate().color(j, C.blue).endAnimate();
    await sd.pause();
    sd.Link(arr.element(j), arr.element(i), sd.Curve, "cx", "y", "cx", "y").bending(-0.5).startAnimate().pointStoT().endAnimate().arrow();
    await sd.pause();
    arr.startAnimate().color(j + 1, i - 1, C.red).endAnimate();
})