import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = 10;
const data = [3, 2, 1, 4, 6, 1, 5, 4, 2, 1, 5, 3, 4, 2];
const arr = new sd.Array(svg);

sd.init(() => {
    arr.pushArray(data);
});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(arr, "i").startAnimate().moveTo(I).endAnimate();
    await sd.pause();
    arr.startAnimate();
    for (let j = 0; j < I; j++) {
        if (data[j] < data[I]) arr.color(j, C.green);
        else arr.color(j, C.red);
    }
    arr.endAnimate();
    await sd.pause();
    const set = new Set();
    for (let j = I - 1; j >= 0; j--) {
        if (data[j] >= data[I]) continue;
        if (set.has(data[j])) continue;
        await sd.pause();
        set.add(data[j]);
        sd.Link(arr.element(j), arr.element(I), sd.Curve, "cx", "my", "cx", "my").startAnimate().pointStoT().endAnimate().arrow();
    }
});
