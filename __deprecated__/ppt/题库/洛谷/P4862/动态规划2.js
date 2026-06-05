import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const rt = new sd.Vertex(svg, "rt");
const lc = new sd.Rect(svg).width(100).height(120);
const rc = new sd.Rect(svg).width(100).height(160);

sd.init(() => {
    lc.mx(rt.cx() - 20).dy(120);
    rc.x(rt.cx() + 20).dy(80);
    sd.Link(rt, lc, sd.Line, "cx", "cy", "cx", "y").arrow().value("a=2", R.pointAtPathByRate(0.5, "mx", "my"));
    sd.Link(rt, rc, sd.Line, "cx", "cy", "cx", "y").arrow().value("b=1", R.pointAtPathByRate(0.5, "x", "my"));
})

sd.main(async () => {
})