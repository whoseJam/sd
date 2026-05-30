import * as sd from "@/sd";

const svg = sd.svg();

const v1 = new sd.Vertex(svg);
const v2 = new sd.Vertex(svg).dx(100);
const v3 = new sd.Vertex(svg).dx(50).dy(-50);
const v4 = new sd.Vertex(svg).dx(50).dy(50);
sd.Link(v1, v2).strokeDashArray([5, 5]);
sd.Link(v3, v4).strokeDashArray([5, 5]);
sd.Link(v1, v3);
sd.Link(v1, v4);
sd.Link(v2, v3);
sd.Link(v2, v4);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    new sd.Line(svg)
        .source(v1.x() - 20, 20)
        .target(v2.mx() + 20, 20)
        .opacity(0)
        .startAnimate()
        .opacity(0.2)
        .endAnimate();
    new sd.Line(svg)
        .source(v3.cx(), v3.y() - 20)
        .target(v3.cx(), v4.my() + 20)
        .opacity(0)
        .startAnimate()
        .opacity(0.2)
        .endAnimate();
});
