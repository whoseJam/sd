import * as sd from "@/sd";

const svg = sd.svg();
const math = new sd.Math(svg, "\\sum_{i=1}^3a_i\\sum_{j=1}^3b_j");
const center = math.center();

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    math.startAnimate(500)
        .text("\\sum_{i=1}^3a_i(b_1+b_2+b_3)", [
            ["\\sum_{i=1}^3a_i", "\\sum_{i=1}^3a_i"],
            ["b_j", "(b_1+b_2+b_3)"],
        ])
        .center(center)
        .endAnimate();
    await sd.pause();
    math.startAnimate(500)
        .text("a_1(b_1+b_2+b_3)+a_2(b_1+b_2+b_3)+a_3(b_1+b_2+b_3)", [
            //
            ["", "a_1"],
            ["", "a_2"],
            ["a_i", "a_3"],
            ["", "(b_1+b_2+b_3)"],
            ["", "(b_1+b_2+b_3)"],
            ["(b_1+b_2+b_3)", "(b_1+b_2+b_3)"],
            ["", "+"],
            ["", "+"],
        ])
        .center(center)
        .endAnimate();
    await sd.pause();
    math.startAnimate(500)
        .text("(a_1+a_2+a_3)(b_1+b_2+b_3)", [
            ["(b_1+b_2+b_3)", ""],
            ["(b_1+b_2+b_3)", ""],
            ["(b_1+b_2+b_3)", "(b_1+b_2+b_3)"],
            ["a_1", "a_1"],
            ["a_2", "a_2"],
            ["a_3", "a_3"],
            ["+", "+"],
            ["+", "+"],
        ])
        .center(center)
        .endAnimate();
    await sd.pause();
    math.startAnimate(500).text("(\\sum_{i=1}^3a_i)(\\sum_{j=1}^3b_j)", { "a_1+a_2+a_3": "\\sum_{i=1}^3a_i", "b_1+b_2+b_3": "\\sum_{j=1}^3b_j" }).center(center).endAnimate();
});
