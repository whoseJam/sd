import * as sd from "@/sd";

const svg = sd.svg();
const p = 10;
const v = 3;
const data = [0, 0, 1, 2, 3, 2, 1, 0, -1, -2, -3, -2, -1, 0, 1, 2, 3, 2, 1, 0, 0, 0];
const arr = new sd.Array(svg).x(100);

sd.init(() => {
    arr.pushArray(data);
    sd.Pointer(arr, "pos").moveTo(p);
});

sd.main(async () => {
    await sd.pause();
    sd.Brace(arr, "t")
        .startAnimate()
        .brace(p - 3 * v + 1, p - 2 * v)
        .endAnimate();
    await sd.pause();
    sd.Brace(arr, "b")
        .startAnimate()
        .brace(p - 2 * v, p - v - 1)
        .endAnimate();
    await sd.pause();
    sd.Brace(arr, "b")
        .startAnimate()
        .brace(p - v + 1, p)
        .endAnimate();
});
