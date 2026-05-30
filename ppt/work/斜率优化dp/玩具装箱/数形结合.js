import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const math = new sd.Math(svg, "{f_i-(s_i^2-2s_iT)}={(f_j+(s_j+T)^2)}-{(2s_i)}{s_j}");

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    math.element(1).startAnimate().color(C.red).endAnimate();
    math.element(2).startAnimate().color(C.textBlue).endAnimate();
    math.element(3).startAnimate().color(C.red).endAnimate();
    math.element(4).startAnimate().color(C.textBlue).endAnimate();
    await sd.pause();
    math.createMath(1).color(C.red).startAnimate().transformMath("b").my(50).endAnimate();
    math.createMath(2).color(C.textBlue).startAnimate().transformMath("y").my(50).endAnimate();
    math.createMath(3).color(C.red).startAnimate().transformMath("k").my(50).endAnimate();
    math.createMath(4).color(C.textBlue).startAnimate().transformMath("x").my(50).endAnimate();
});
