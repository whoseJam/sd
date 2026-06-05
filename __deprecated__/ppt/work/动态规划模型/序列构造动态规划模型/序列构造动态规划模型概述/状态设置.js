import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const EN = sd.enter();
const n = 10;
const arr = new sd.Array(svg).start(1).resize(n);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    const p0 = sd.Pointer(arr, "i", "b", 3, 20);

    p0.startAnimate().moveTo(n).endAnimate();
    const b = sd.Brace(arr);
    b.startAnimate().brace(1, n, "b", 3).value("?").endAnimate();
    await sd.pause();
    const p1 = sd.Pointer(arr, "i+1", "b", 3, 20);
    arr.startAnimate();
    arr.push();
    arr.lastElement().color(C.blue);
    b.brace(1, n + 1);
    p1.moveTo(n + 1);
    arr.endAnimate();
});
