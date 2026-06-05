import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const V = sd.vec();
const u = new sd.Vertex(svg, "u");
const v = new sd.Vertex(svg, "v").dx(120);

sd.init(() => {
    sd.Link(u, v).stroke(C.red).strokeWidth(2).arrow().value("返祖边", R.pointAtPathByRate(0.5, "cx", "my"));
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
