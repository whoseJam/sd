import * as sd from "@/sd";

const svg = sd.svg();
const math = new sd.Math(svg, "\\sum_{i=1}^3ca_i");
const center = math.center();

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    math.startAnimate(500)
        .text("ca_1+ca_2+ca_3", [["ca_i", "ca_1+ca_2+ca_3"]])
        .center(center)
        .endAnimate();
    await sd.pause();
    math.startAnimate(500)
        .text("c(a_1+a_2+a_3)", [
            //
            ["a_1", "a_1"],
            ["a_2", "a_2"],
            ["a_3", "a_3"],
            { source: "c", target: { subtext: "c", i: 0 } },
            { source: "c", target: { subtext: "c", i: 0 } },
            { source: "c", target: { subtext: "c", i: 0 } },
            ["+", "+"],
            ["+", "+"],
        ])
        .endAnimate();
    await sd.pause();
    math.startAnimate(500).text("c\\sum_{i=1}^3a_i", { "a_1+a_2+a_3": "a_i", "c": "c" }).center(center).endAnimate();
});
