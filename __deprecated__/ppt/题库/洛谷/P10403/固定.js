import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const l = 1;
const r = 4;
const rr = 8;
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
        .value("$gcd\\gt 2$")
        .endAnimate();
    sd.Brace(arr, "b")
        .brace(r, rr - 1)
        .stroke(C.green)
        .strokeWidth(2)
        .startAnimate()
        .pointTtoS()
        .value("$gcd=2$")
        .endAnimate();

    sd.Brace(arr, "b").brace(rr, n).stroke(C.grey).strokeWidth(2).startAnimate().pointTtoS().value("$gcd=1$").endAnimate();
    await sd.pause();
    const pointer = sd.Pointer(arr, "r").startAnimate().moveTo(r).endAnimate();
    await sd.pause();
    pointer
        .startAnimate()
        .moveTo(rr - 1)
        .endAnimate();
});
