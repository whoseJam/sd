import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg);
const [l, r] = [2, 8];
const colors = [C.purple, C.green, C.yellow, C.blue];
const arrColors = [0, 1, 1, 2, 1, 0, 3, 0, 3, 3, 1];
arr.resize(arrColors.length);
sd.Pointer(arr, "l", "t").moveTo(l);
sd.Pointer(arr, "r", "t").moveTo(r);
sd.Focus(arr).focus(l, r);

sd.init(() => {
    for (let i = 0; i < arrColors.length; i++) arr.color(i, colors[arrColors[i]]);
});

sd.main(async () => {
    await sd.pause();
    arr.startAnimate()
        .color(l - 1, C.pureBlue)
        .endAnimate();
    await sd.pause();
    arr.startAnimate()
        .color(r - 1, C.pureBlue)
        .endAnimate();
});
