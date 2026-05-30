import * as sd from "@/sd";

const svg = sd.svg();
const math = new sd.Math(svg, "\\sum_{i=1}^3(a_i+b_i)");
const center = math.center();

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    math.startAnimate(500)
        .text("a_1+b_1+a_2+b_2+a_3+b_3", [["(a_i+b_i)", "a_1+b_1+a_2+b_2+a_3+b_3"]])
        .center(center)
        .endAnimate();
    await sd.pause();
    math.startAnimate(500).text("a_1+a_2+a_3+b_1+b_2+b_3", { a_1: "a_1", a_2: "a_2", a_3: "a_3", b_1: "b_1", b_2: "b_2", b_3: "b_3" }).endAnimate();
    await sd.pause();
    math.startAnimate(500).text("\\sum_{i=1}^3a_i+\\sum_{i=1}^3b_i", { "a_1+a_2+a_3": "a_i", "b_1+b_2+b_3": "b_i", "+": "+" }).center(center).endAnimate();
});
