import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const V = sd.vec();
const tri = new sd.Triangle(svg).height(140).width(100);
const v = new sd.Vertex(svg, "u").center(tri.pos("cx", "y"));
let fromRoot;

sd.init(() => {
    const path = new sd.Path(svg);
    const pen = new sd.PathPen();
    pen.MoveTo(v.pos("cx", "my"));
    pen.lineTo(-10, 20);
    pen.lineTo(20, 20);
    pen.lineTo(-30, 20);
    pen.lineTo(40, 20);
    path.d(pen.toString());
    path.arrow();
    const top = v.pos("cx", "y");
    fromRoot = new sd.Line(svg)
        .source(V.add(top, [60, -40]))
        .target(top)
        .arrow()
        .value("...", R.pointAtPathByRate(0, "x", "cy"));
});

sd.main(async () => {
    await sd.pause();
    const c1 = new sd.Curve(svg);
    c1.source(V.add(v.pos("cx", "my"), [20, 80]));
    c1.target(fromRoot.at(0.2));
    c1.startAnimate().pointStoT().endAnimate().arrow();
});
