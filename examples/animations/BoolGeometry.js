import * as sd from "@/sd";

const svg = sd.svg();
const V = sd.vec();
const C = sd.color();

sd.init(() => {});

sd.main(TestIntersection);

async function TestIntersection() {
  const r = new sd.Rect(svg).x(100).y(100);
  const c = new sd.Circle(svg).x(110).y(110);
  V.polyIntersect(r, c).color(C.red);

  const e = new sd.Ellipse(svg).x(200).y(100).rx(40);
  const p = new sd.Polygon(svg, [
    [210, 110],
    [250, 50],
    [300, 130],
  ]);
  V.polyIntersect(e, p).color(C.red);
}
