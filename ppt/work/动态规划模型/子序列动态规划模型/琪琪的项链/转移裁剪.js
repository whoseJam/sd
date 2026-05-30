import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = 7;
const colors = [C.red, C.red, C.blue, C.green, C.green, C.red, C.green, C.green, C.red, C.red, C.red, C.red];
const arr = new sd.Array(svg).resize(colors.length);

sd.init(() => {
    for (let i = 0; i < colors.length; i++) {
        arr.color(i, colors[i]);
    }
});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(arr, "i").startAnimate().moveTo(I).endAnimate();
    await sd.pause();
    const set = new Set();
    for (let j = I - 1; j >= 0; j--) {
        if (set.has(colors[j])) continue;
        await sd.pause();
        set.add(colors[j]);
        sd.Link(arr.element(j), arr.element(I), sd.Curve, "cx", "my", "cx", "my").startAnimate().pointStoT().endAnimate().arrow();
    }
});
