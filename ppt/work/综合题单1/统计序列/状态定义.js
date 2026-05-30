import * as sd from "@/sd";

const svg = sd.svg();
const n = 10;
const i = 7;
const arr = new sd.Array(svg).start(1).resize(n);

sd.init(() => {
    sd.Pointer(arr, "i").moveTo(i);
});

sd.main(async () => {
    await sd.pause();
    const brace = sd.Brace(arr);
    brace
        .value("j个f=1")
        .startAnimate()
        .brace(1, i - 1)
        .endAnimate();
});
