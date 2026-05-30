import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const sum = new sd.Math(svg, "\\sum_{?}^??").fontSize(40).x(900);
const text = new sd.Text(svg, "for(int i=2;i<=n;i+=2)ans+=i;").fontSize(40).cy(sum.cy());

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    text.startAnimate().subtextColor("i=2", C.orange).endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{i=2}^??", [["?", "i=2"]])
        .subtextColor("i=2", C.orange)
        .endAnimate();
    await sd.pause();
    text.startAnimate().subtextColor("i<=n", C.textBlue).endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{i=2}^{n}?", [
            ["?", "n"],
            ["i=2", "i=2"],
        ])
        .cy(text.cy())
        .subtextColor("n", C.textBlue)
        .endAnimate();
    await sd.pause();
    text.startAnimate().subtextColor("ans+=i", C.red).endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{i=2}^{n}i", [
            ["i=2", "i=2"],
            ["n", "n"],
            ["?", "i"],
        ])
        .subtextColorLast("i", C.red)
        .endAnimate();
    await sd.pause();
    text.startAnimate().subtextColor("i+=2", C.green).endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{i=2}^{n}i[i\\; is\\; even]", [
            ["", "[i\\; is\\; even]"],
            ["i=2", "i=2"],
            ["n", "n"],
            ["i", "i"],
        ])
        .subtextColor("[i\\; is\\; even]", C.green)
        .endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{\\begin{aligned}2\\le & i\\le n\\\\i\\; is &\\; even \\end{aligned} }i", [
            //
            ["i=2", "\\begin{aligned}2\\le & i\\le n\\end{aligned}"],
            { source: "n", target: { subtext: "n", i: 0 } },
            ["[i\\; is\\; even]", "\\begin{aligned}i\\; is &\\; even \\end{aligned}"],
            ["i", "i"],
        ])
        .cy(text.cy())
        .endAnimate();
});
