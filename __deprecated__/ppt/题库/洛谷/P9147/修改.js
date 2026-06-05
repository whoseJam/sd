import * as sd from "@/sd";

const svg = sd.svg();
const bar = new sd.BarArray(svg).pushArray([3, 5, 8, 6, 1, 2, 3, 6, 5, 7, 8]);
const pointer = sd.Pointer(bar, "i", "t");
const at1 = 7;
const at2 = 3;

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    pointer.startAnimate().moveTo(at1).endAnimate();
    bar.startAnimate().opacity(at1, 0).endAnimate();
    await sd.pause();
    pointer.startAnimate().moveTo(at2).endAnimate();
    bar.startAnimate().opacity(at1, 1).opacity(at2, 0).endAnimate();
});
