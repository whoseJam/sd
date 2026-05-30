import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const V = sd.vec();
const u = new sd.Vertex(svg, "u").dx(100).dy(-100);
let v;

sd.init(() => {
    sd.Link(u, drawSubtree("v1", 0, 0)).arrow();
    sd.Link(u, (v = drawSubtree("v2", 120, 0))).arrow();
    sd.Link(u, drawSubtree("v3", 240, 0)).arrow();
    const top = V.add(u.center(), [u.r() / Math.sqrt(2), -u.r() / Math.sqrt(2)]);
    new sd.Line(svg)
        .source(V.add(top, [30, -30]))
        .target(top)
        .arrow()
        .value("...", R.pointAtPathByRate(0, "x", "cy"));
});

function drawSubtree(value, x, y) {
    const tri = new sd.Triangle(svg).height(140).width(100).cx(x).y(y);
    const v = new sd.Vertex(svg, value).center(tri.pos("cx", "y"));
    const path = new sd.Path(svg);
    const pen = new sd.PathPen();
    pen.MoveTo(v.pos("cx", "my"));
    pen.lineTo(-10, 20);
    pen.lineTo(20, 20);
    pen.lineTo(-30, 20);
    pen.lineTo(40, 20);
    path.d(pen.toString());
    path.arrow();
    return v;
}

sd.main(async () => {
    await sd.pause();
    const c1 = new sd.Curve(svg);
    c1.source(V.add(v.pos("cx", "my"), [20, 80]));
    c1.target(u.center());
    sd.trim(c1, null, u);
    c1.startAnimate().pointStoT().endAnimate().arrow();
});
