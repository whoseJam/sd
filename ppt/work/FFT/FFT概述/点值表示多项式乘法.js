import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const L = 10;
const coord = new sd.Coord(svg)
    .viewX(-L / 2)
    .viewY(-15)
    .viewWidth(L)
    .viewHeight(25);

sd.init(() => {
    coord.width(300).height(250);
});

async function Sample(curve, sampleX) {
    await sd.pause();
    const circles = [];
    for (let i = 0; i < sampleX.length; i++) {
        const point = [coord.globalX(sampleX[i]), curve.globalY(sampleX[i])];
        circles.push(new sd.Circle(svg).r(5).color(C.orange).center(point).opacity(0).startAnimate().opacity(1).endAnimate());
    }
}

sd.main(async () => {
    await sd.pause();
    coord.startAnimate();
    const A = coord.draw(1, x => x - 1.5);
    coord.endAnimate();
    await sd.pause();
    coord.startAnimate();
    const B = coord.draw(2, x => 0.5 * x + 4);
    coord.endAnimate();

    await Sample(A, [-2, 0, 2]);
    await Sample(B, [-2, 0, 2]);
    const X = coord
        .draw(3, x => (x - 1.5) * (0.5 * x + 4))
        .opacity(0)
        .stroke(C.red);
    await Sample(X, [-2, 0, 2]);
    await sd.pause();
    X.opacity(1).startAnimate().pointStoT().endAnimate();
});
