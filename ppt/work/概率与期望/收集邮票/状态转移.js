import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const v1 = new sd.Box(svg, "有k张").width(80).height(20);
const v2 = new sd.Box(svg, "有k+1张").width(80).height(20);
const v3 = new sd.Box(svg, "有k张").width(80).height(20);

sd.init(() => {
    v2.dx(120).dy(-30);
    v3.dx(120).dy(30);
    sd.Link(v1, v2).arrow().value(new sd.Math(svg, "\\frac{n-k}{n}").fontSize(8), R.pointAtPathByRate(0.5, "cx", "my", -5));
    sd.Link(v1, v3).arrow().value(new sd.Math(svg, "\\frac{k}{n}").fontSize(8), R.pointAtPathByRate(0.5, "cx", "y", -5));
});

sd.main(async () => {});
