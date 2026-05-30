import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const vi = new sd.Vertex(svg, "i");
const vj = new sd.Vertex(svg, "j").dx(200);
const vk = new sd.Vertex(svg, "k").dx(100).dy(-70);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    sd.Link(vi, vj)
        .startAnimate()
        .pointStoT()
        .value(new sd.Math(svg, "d_{i,j}").fontSize(15), R.pointAtPathByRate(0.5, "cx", "y", 0, 0 + 2))
        .endAnimate()
        .arrow();
    await sd.pause();
    sd.Link(vi, vk).startAnimate().pointStoT().value(new sd.Math(svg, "d_{i,k}").fontSize(15), R.pointAtPathByRate(0.5, "mx", "my")).endAnimate().arrow();
    sd.Link(vk, vj).startAnimate().pointStoT().value(new sd.Math(svg, "d_{k,j}").fontSize(15), R.pointAtPathByRate(0.5, "x", "my")).endAnimate().arrow();
});
