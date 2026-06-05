import * as sd from "@/sd";

const svg = sd.svg();
const u = new sd.Vertex(svg, "u");
const v = new sd.Vertex(svg, "v").dx(100);
sd.Link(u, v).arrow();
sd.Label(v, "$isEnd(v)?$", "tc").fontSize(15);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(u, "i", "t").startAnimate().moveTo(u).endAnimate();
    await sd.pause();
    sd.Pointer(v, "i+1", "t").startAnimate().moveTo(v).endAnimate();
});
