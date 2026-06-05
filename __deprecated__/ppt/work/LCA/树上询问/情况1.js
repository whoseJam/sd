import * as sd from "@/sd";

const svg = sd.svg();
const L = 100;
const lca = new sd.Vertex(svg).cx(0).cy(0);
const mid = new sd.Vertex(svg, "c").cx(-L).cy(100);
const x = makeSubtree("a", -L * 3, 300);
const y = makeSubtree("b", L, 100);
const v1 = makeSubtree(" ", -L - 20, 160, 0.7);
const v2 = makeSubtree(" ", -L + 60, 160, 0.7);

sd.init(() => {
    sd.Link(lca, mid);
    sd.Link(mid, x);
    sd.Link(lca, y);
    sd.Link(mid, v1);
    sd.Link(mid, v2);
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
