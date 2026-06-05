import * as sd from "@/sd";

const svg = sd.svg();
const n = 10;
const I = 8;
const J = 3;
const arr = new sd.Array(svg).resize(n);

sd.init(() => {
    sd.Pointer(arr, "i").moveTo(I);
});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(arr, "j").startAnimate().moveTo(J).endAnimate();
    await sd.pause();
    sd.Brace(arr, "b")
        .brace(J + 1, I)
        .startAnimate()
        .pointTtoS()
        .value(new sd.Math(svg, "$V_{j+1,i}^2$").fontSize(15))
        .endAnimate();
});
