import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const V = sd.vec();
const u = new sd.Vertex(svg, "u");
const v = new sd.Vertex(svg, "v").dx(180);

sd.init(() => {
    const l = sd.Link(u, v).stroke(C.red).strokeWidth(2).arrow();
    sd.Link(u, v).stroke(C.purple).strokeWidth(2).strokeDashArray([5, 5]);
    l.childAs("l1", new sd.Text(svg, "横叉边(同块内)"), R.pointAtPathByRate(0.5, "cx", "my"));
    l.childAs("l2", new sd.Text(svg, "返祖边"), R.pointAtPathByRate(0.5, "cx", "y"));
    const src = v.center();
    function draw(arc, r = 80) {
        const line = new sd.Line(v);
        line.source(src);
        line.target(V.add(src, V.makeComplex(r, arc)));
        line.arrow();
        sd.trim(line, v, null);
    }
    draw(Math.PI / 4);
    draw(Math.PI / 8);
    draw(0);
    draw(-Math.PI / 8);
    draw(-Math.PI / 4);
});

sd.main(async () => {});
