import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const l = 3;
const r = 6;
const arr = new sd.Array(svg).resize(n).start(1);

sd.init(() => {
    sd.Pointer(arr, "i").moveTo(l);
});

sd.main(async () => {
    await sd.pause();
    sd.Brace(arr, "b").brace(l, r).stroke(C.green).strokeWidth(2).startAnimate().pointTtoS().value("visible").endAnimate();
    sd.Brace(arr, "b")
        .brace(r + 1, n)
        .stroke(C.grey)
        .strokeWidth(2)
        .startAnimate()
        .pointTtoS()
        .value("not visible")
        .endAnimate();
});
