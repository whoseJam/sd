import * as sd from "@/sd";

const svg = sd.svg();
const L = 100;
const lca = new sd.Vertex(svg, "c").cx(0).cy(0);
const x = makeSubtree("a", -L * 2, 300);
const y = makeSubtree("b", L * 2, 300);
const v1 = makeSubtree(" ", -40, 120, 0.7);
const v2 = makeSubtree(" ", +40, 120, 0.7);

sd.init(() => {
    sd.Link(lca, x);
    sd.Link(lca, y);
    sd.Link(lca, v1);
    sd.Link(lca, v2);
    const line = new sd.Line(svg).source(-60, -60).target(lca.center());
    sd.trim(line, null, lca);
});

sd.main(async () => {});

function makeSubtree(value, x, y, scale = 1) {
    const tri = new sd.Triangle(svg)
        .height(140 * scale)
        .width(100 * scale)
        .cx(x)
        .y(y);
    const v = new sd.Vertex(svg, value).center(tri.pos("cx", "y"));
    return v;
}
