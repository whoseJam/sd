import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const i = 6;
const arr = new sd.Array(svg).resize(n).start(1);

sd.init(() => {
    sd.Pointer(arr, "i", "b", 3, 20, 3).moveTo(i);
    sd.Brace(arr).brace(1, i, "b").value("j");
})

sd.main(async () => {
    await sd.pause();
    arr.startAnimate().color(i + 1, C.orange).endAnimate();
})