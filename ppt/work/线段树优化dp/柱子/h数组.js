import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const target = 5;
const d = 3;
const arr = new sd.Array(svg).start(1).resize(n);

sd.init(() => {
    sd.Label(arr, "h", "lc");
    sd.Label(arr, `d=${d}`, "rc");
    sd.Pointer(arr, "i", "b", 10, 30).moveTo(target);
})

sd.main(async () => {
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        if (Math.abs(i - target) >= d) {
            sd.Pointer(arr, "j", "t", 10, 30).startAnimate().moveTo(i).endAnimate();
        }
    }
    await sd.pause();
    arr.startAnimate();
    for (let i = 1; i <= n; i++) {
        if (Math.abs(i - target) >= d) {
            arr.color(i, C.green);
        }
    }
    arr.endAnimate();
})