import * as sd from "@/sd";

const svg = sd.svg();
const L = 100;
const a = new sd.Vertex(svg, "a").cx(0);
const b = new sd.Vertex(svg, "b").cx(L * 4);
const c = new sd.Vertex(svg, "c").cx(L * 2.5);
const s1 = makeSubtree(" ", L * 2.5 - 60, 80);
const s2 = makeSubtree(" ", L * 2.5 + 60, 80);

sd.init(() => {
    sd.Link(a, c);
    sd.Link(c, b);
    sd.Link(c, s1);
    sd.Link(c, s2);
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
