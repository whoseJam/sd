import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const V = sd.vec();
const u = new sd.Vertex(svg, "f").dx(100).dy(-100);
const vs = [];
let fromRoot;

sd.init(() => {
    const v1 = drawSubtree(" ", 0, 0);
    const v2 = drawSubtree("u", 120, 0);
    const v3 = drawSubtree(" ", 240, 0);
    vs.push(v2);
    sd.Link(u, v1).arrow();
    sd.Link(u, v2).arrow();
    sd.Link(u, v3).arrow();
    const top = V.add(u.center(), [u.r() / Math.sqrt(2), -u.r() / Math.sqrt(2)]);
    fromRoot = new sd.Line(svg)
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
    const v = vs[0];
    await sd.pause();
    const c = new sd.Curve(svg);
    c.source(V.add(v.pos("cx", "my"), [20, 80]));
    c.target(fromRoot.at(0.5));
    sd.trim(c, null, u);
    c.startAnimate().pointStoT().endAnimate().arrow();
    await sd.pause();
    c.startAnimate();
    c.source(V.add(v.pos("cx", "my"), [20, 80]));
    c.target(u.center());
    sd.trim(c, null, u);
    c.endAnimate();
});
