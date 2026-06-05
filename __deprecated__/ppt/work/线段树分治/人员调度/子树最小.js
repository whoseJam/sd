import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const V = sd.vec();
const EN = sd.enter();
const subtree = new sd.Triangle(svg).width(150).height(200);
const f = new sd.Vertex(svg, "f");
f.childAs(subtree.onEnter(EN.nothing()), (parent, child) => {
    child.cx(parent.cx()).y(parent.cy());
});
const u = new sd.Vertex(svg, "u").center(subtree.kx(0.33), subtree.ky(0.7));
const c = new sd.Vertex(svg).center(subtree.kx(0.67), subtree.ky(0.7));
const ff = new sd.Vertex(svg);
const fff = new sd.Vertex(svg);
ff.center(V.add(f.center(), [50, -50]));
fff.center(V.add(ff.center(), [50, -50]));

sd.init(() => {
    sd.Link(fff, ff);
    sd.Link(ff, f);
    sd.Link(f, c, sd.Curve).bending(-0.4).value("min", R.pointAtPathByRate(0.5, "x", "cy", 3)).arrow().strokeDashArray([5, 5]);
});

sd.main(async () => {});
