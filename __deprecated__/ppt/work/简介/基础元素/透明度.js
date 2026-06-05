import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const V = sd.vec();

sd.init(() => {});

sd.main(async () => {
    const p1 = V.makeComplex(10, 0);
    const p2 = V.makeComplex(10, (Math.PI * 2) / 3);
    const p3 = V.makeComplex(10, ((Math.PI * 2) / 3) * 2);
    const c1 = new sd.Circle(svg).color(C.red).opacity(0.5).center(p1);
    const c2 = new sd.Circle(svg).color(C.red).opacity(0.5).center(p2);
    const c3 = new sd.Circle(svg).color(C.red).opacity(0.5).center(p3);
    await sd.pause();
    c1.startAnimate().opacity(1).fillOpacity(0.5).endAnimate();
    c2.startAnimate().opacity(1).fillOpacity(0.5).endAnimate();
    c3.startAnimate().opacity(1).fillOpacity(0.5).endAnimate();
});
