import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const l = 3;
const r = 6;
const arr = new sd.Array(svg).resize(n).start(1);

sd.init(() => {
    sd.Pointer(arr, "l").moveTo(l);
});

sd.main(async () => {
    await sd.pause();
    sd.Brace(arr, "b")
        .brace(l, r - 1)
        .stroke(C.grey)
        .strokeWidth(2)
        .startAnimate()
        .pointTtoS()
        .value("$sum\\lt M$")
        .endAnimate();
    sd.Brace(arr, "b").brace(r, n).stroke(C.green).strokeWidth(2).startAnimate().pointTtoS().value("$sum\\ge M$").endAnimate();
    await sd.pause();
    sd.Pointer(arr, "r").startAnimate().moveTo(r).endAnimate();
});
