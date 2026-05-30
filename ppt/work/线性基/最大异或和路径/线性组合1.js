import * as sd from "@/sd";

const svg = sd.svg();
const V = sd.vec();
const pen = new sd.PathPen();
const v1 = new sd.Vertex(svg, "1");
const v2 = new sd.Vertex(svg, "n").x(300);
const downDist = 50;
const radius = 30;
const d = V.sub(v2.center(), v1.center());
const m1 = V.add(v1.center(), V.numberMul(d, 1 / 3));
const m2 = V.add(v1.center(), V.numberMul(d, 2 / 3));

sd.init(() => {
    pen.MoveTo(V.add(v1.center(), [v1.r(), 0]));
    pen.LineTo(m1);
    pen.LineTo(V.add(m1, [0, downDist]));
    pen.Arc(radius, radius, 0, 1, 0, V.add(m1, [2, downDist]));
    pen.LineTo(V.add(m1, [2, 0]));
    pen.LineTo(m2);
    pen.LineTo(V.add(m2, [0, downDist]));
    pen.Arc(radius, radius, 0, 1, 0, V.add(m2, [2, downDist]));
    pen.LineTo(V.add(m2, [2, 0]));
    pen.LineTo(V.add(v2.center(), [-v2.r(), 0]));
});

sd.main(async () => {
    await sd.pause();
    const path = new sd.Path(svg).d(pen.toString());
    path.startAnimate(1500).pointStoT().endAnimate().arrow();
});
