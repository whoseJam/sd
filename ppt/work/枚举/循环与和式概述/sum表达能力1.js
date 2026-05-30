import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const sum = new sd.Math(svg, "\\sum_{?}^??").fontSize(40).x(900);
const text = new sd.Text(svg, "for(int i=1;i<=n;i++)ans+=i*i;").fontSize(40).cy(sum.cy());

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    text.startAnimate().subtextColor("i=1", C.orange).endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{i=1}^??", [["?", "i=1"]])
        .subtextColor("i=1", C.orange)
        .endAnimate();
    await sd.pause();
    text.startAnimate().subtextColor("i<=n", C.textBlue).endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{i=1}^n?", [
            ["?", "n"],
            ["i=1", "i=1"],
        ])
        .cy(text.cy())
        .subtextColor("n", C.textBlue)
        .endAnimate();
    await sd.pause();
    text.startAnimate().subtextColor("ans+=i*i", C.red).endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{i=1}^ni^2", [
            ["?", "i^2"],
            ["n", "n"],
            ["i=1", "i=1"],
        ])
        .subtextColorLast("i^2", C.red)
        .endAnimate();
});
