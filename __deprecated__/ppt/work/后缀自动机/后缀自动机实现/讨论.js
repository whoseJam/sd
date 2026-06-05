import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const p = new sd.Vertex(svg, "p");
const q = new sd.Vertex(svg, "q").x(80).y(80);
const u = new sd.Vertex(svg, "u").y(80);

sd.init(() => {
    sd.Link(p, q).arrow().value("c", R.pointAtPathByRate(0.4, "x", "cy"));
    sd.Link(p, u).arrow().value("c", R.pointAtPathByRate(0.4, "mx", "cy"));
})

sd.main(async () => {
    sd.Aside(p, new sd.Array(svg).elementWidth(20).elementHeight(20).pushArray("***"), "rc");
    sd.Aside(q, new sd.Array(svg).elementWidth(20).elementHeight(20).pushArray("***c"), "rc");
    sd.Aside(u, new sd.Array(svg).elementWidth(20).elementHeight(20).pushArray("???***c"), "bc");
})