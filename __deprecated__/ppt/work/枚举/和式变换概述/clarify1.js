import * as sd from "@/sd";

const svg = sd.svg();
const math1 = new sd.Math(svg, "\\sum_{i=1}^3iF(i)");
const math2 = new sd.Math(svg, "F(i)\\sum_{i=1}^3i").dy(80);
const center1 = math1.center();
const center2 = math2.center();

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    math1.startAnimate().text("1F(1)+2F(2)+3F(3)").center(center1).endAnimate();
    await sd.pause();
    math2.startAnimate().text("F(i)(1+2+3)").center(center2).endAnimate();
});
