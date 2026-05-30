import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const sum = new sd.Math(svg, "\\sum_{?}^??").fontSize(40).x(900);
const text = new sd.Text(svg, "for(int i=n;i<=n*2;i++)ans+=(i-n+1);").fontSize(40).cy(sum.cy());

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    text.startAnimate().subtextColor("i=n", C.orange).endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{i=n}^??", [["?", "i=n"]])
        .subtextColor("i=n", C.orange)
        .endAnimate();
    await sd.pause();
    text.startAnimate().subtextColor("i<=n*2", C.textBlue).endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{i=n}^{2n}?", [
            ["?", "2n"],
            ["i=n", "i=n"],
        ])
        .cy(text.cy())
        .subtextColor("2n", C.textBlue)
        .endAnimate();
    await sd.pause();
    text.startAnimate().subtextColor("ans+=(i-n+1)", C.red).endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{i=n}^{2n}(i-n+1)", [
            ["?", "(i-n+1)"],
            ["2n", "2n"],
            ["i=n", "i=n"],
        ])
        .subtextColorLast("(i-n+1)", C.red)
        .endAnimate();
});
