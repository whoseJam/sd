import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const sum = new sd.Math(svg, "\\sum_{?}^??").fontSize(40).x(900);
const text = new sd.Code(svg, "for(int i=1;i<=n;i++)\n    if(n%i==0)ans+=i;").fontSize(40).cy(sum.cy());

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    text.element(1).startAnimate().subtextColor("i=1", C.orange).endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{i=1}^??", [["?", "i=1"]])
        .subtextColor("i=1", C.orange)
        .endAnimate();
    await sd.pause();
    text.element(1).startAnimate().subtextColor("i<=n", C.textBlue).endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{i=1}^{n}?", [
            ["?", "n"],
            ["i=1", "i=1"],
        ])
        .cy(text.cy())
        .subtextColor("n", C.textBlue)
        .endAnimate();
    await sd.pause();
    text.element(2).startAnimate().subtextColor("ans+=i", C.red).endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{i=1}^{n}i", [
            ["i=1", "i=1"],
            ["n", "n"],
            ["?", "i"],
        ])
        .subtextColorLast("i", C.red)
        .endAnimate();
    await sd.pause();
    text.element(2).startAnimate().subtextColor("n%i==0", C.green).endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{i=1}^{n}i[i|n]", [
            ["", "[i|n]"],
            ["i=1", "i=1"],
            ["n", "n"],
            ["i", "i"],
        ])
        .subtextColor("[i|n]", C.green)
        .endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{\\begin{aligned}1\\le & i\\le n\\\\ i&|n\\end{aligned} }i", [
            //
            ["i=1", "\\begin{aligned}1\\le & i\\le n\\end{aligned}"],
            { source: "n", target: { subtext: "n", i: 0 } },
            ["[i|n]", "\\begin{aligned}i&|n\\end{aligned}"],
            ["i", "i"],
        ])
        .cy(text.cy())
        .endAnimate();
    await sd.pause();
    sum.startAnimate()
        .text("\\sum_{i|n}i", [
            //
            ["\\begin{aligned}1\\le & i\\le n\\end{aligned}", ""],
            ["\\begin{aligned}i&|n\\end{aligned}", "i|n"],
            ["i", "i"],
        ])
        .cy(text.cy())
        .endAnimate();
});
