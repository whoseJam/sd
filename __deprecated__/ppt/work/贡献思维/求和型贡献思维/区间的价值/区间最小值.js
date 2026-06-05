import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.BarArray(svg).start(1);
const data = [2, 1, 4, 3, 5, 4, 6];

sd.init(() => {
    arr.pushArray(data);
    sd.Label(arr, "a数组", "tc");
})

sd.main(async () => {
    await sd.pause();
    arr.startAnimate().color(4, C.blue).endAnimate();
    sd.Pointer(arr, "i", "t", 3, 20, 3).startAnimate().moveTo(4).endAnimate();
    sd.Pointer(arr, "Li", "t", 3, 20, 3).startAnimate().moveTo(3).endAnimate();
    sd.Pointer(arr, "Ri", "t", 3, 20, 3).startAnimate().moveTo(7).endAnimate();
})