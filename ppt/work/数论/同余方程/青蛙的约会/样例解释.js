import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const V = sd.vec();
const r = 80;
const L = 5;
const [x, m] = [1, 3];
const [y, n] = [2, 4];
const circle = new sd.Circle(svg).fillOpacity(0).r(r);
const ticks = [];

sd.init(() => {
    const angle = (Math.PI * 2) / L;
    for (let i = 0; i < L; i++) {
        const tick = new sd.Line(svg);
        tick.source(V.add(circle.center(), V.makeComplex(r - 2, angle * i)));
        tick.target(V.add(circle.center(), V.makeComplex(r + 2, angle * i)));
        ticks.push(tick);
    }
});

sd.main(async () => {
    await sd.pause();
    const A = new sd.Circle(svg).color(C.green).r(2).center(ticks[x].center()).opacity(0).startAnimate().opacity(1).endAnimate();
    const B = new sd.Circle(svg).color(C.textBlue).r(2).center(ticks[y].center()).opacity(0).startAnimate().opacity(1).endAnimate();
    let ca = x;
    let cb = y;
    for (let i = 1; i <= 10; i++) {
        await sd.pause();
        const nca = (ca + m) % L;
        const ncb = (cb + n) % L;
        sd.Link(ticks[ca], ticks[nca], sd.Line).stroke(C.green).startAnimate().pointStoT().endAnimate().arrow();
        sd.Link(ticks[cb], ticks[ncb], sd.Line).stroke(C.textBlue).startAnimate().pointStoT().endAnimate().arrow();
        A.startAnimate().center(ticks[nca].center()).endAnimate();
        B.startAnimate().center(ticks[ncb].center()).endAnimate();
        ca = nca;
        cb = ncb;
    }
});
