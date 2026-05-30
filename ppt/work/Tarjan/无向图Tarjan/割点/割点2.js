import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const V = sd.vec();
const u = new sd.Vertex(svg, "u").dx(100).dy(-100);
const vs = [];
let fromRoot;

sd.init(() => {
    const v1 = drawSubtree("v1", 0, 0);
    const v2 = drawSubtree("v2", 120, 0);
    const v3 = drawSubtree("v3", 240, 0);
    vs.push(v1);
    vs.push(v2);
    vs.push(v3);
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
    await sd.pause();
    vs.forEach((v, i) => {
        const c = new sd.Curve(svg);
        c.source(V.add(v.pos("cx", "my"), [20, 80]));
        c.target(fromRoot.at(0.6 - i * 0.2));
        sd.trim(c, null, u);
        c.startAnimate().pointStoT().endAnimate().arrow();
    });
});
