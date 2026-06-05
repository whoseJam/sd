import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const V = sd.vec();
const tri = new sd.Triangle(svg).height(140).width(100).dx(-10);
const u = new sd.Vertex(svg, "f").dx(80).dy(-80);
const v = new sd.Vertex(svg, "u").center(tri.pos("cx", "y"));
const vv = drawSubtree(" ", tri.cx() + 120, tri.y());

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
    sd.Link(u, v).arrow();
    sd.Link(u, vv).arrow();
    const top = V.add(u.center(), [u.r() / Math.sqrt(2), -u.r() / Math.sqrt(2)]);
    new sd.Line(svg)
        .source(V.add(top, [30, -30]))
        .target(top)
        .arrow()
        .value("...", R.pointAtPathByRate(0, "x", "cy"));
});

sd.main(async () => {
    await sd.pause();
    const c1 = new sd.Curve(svg);
    c1.source(V.add(v.pos("cx", "my"), [20, 80]));
    c1.target(v.center());
    sd.trim(c1, null, v);
    c1.startAnimate().pointStoT().endAnimate().arrow();
    await sd.pause();
    const text = new sd.Math(svg, "N_A(u),N_B(u)").fontSize(15);
    v.startAnimate()
        .childAs(text, (parent, child) => {
            child.mx(parent.cx()).my(parent.y());
        })
        .endAnimate();
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
