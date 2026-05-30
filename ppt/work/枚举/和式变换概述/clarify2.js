import * as sd from "@/sd";

const svg = sd.svg();
const math = new sd.Math(svg, "\\sum_{i=1}^3\\sum_{j=1}^3a_ib_j");
const center = math.center();

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    math.startAnimate().text("\\sum_{i=1}^3a_ib_1+a_ib_2+a_ib_3").center(center).endAnimate();
    await sd.pause();
    math.startAnimate().text("\\sum_{i=1}^3a_i(b_1+b_2+b_3)", { b_1: "b_1", b_2: "b_2", b_3: "b_3" }).center(center).endAnimate();
    await sd.pause();
    math.startAnimate().text("\\sum_{i=1}^3a_i\\sum_{j=1}^3b_j", { "(b_1+b_2+b_3)": "\\sum_{j=1}^3b_j" }).center(center).endAnimate();
});
