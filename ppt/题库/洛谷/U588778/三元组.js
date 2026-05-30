import * as sd from "@/sd";

const svg = sd.svg();
const u = new sd.Vertex(svg, "u").cx(0);
const s1 = makeSubtree("v1", -150, 100);
const s2 = makeSubtree("v2", 0, 100);
const s3 = makeSubtree("v3", 150, 100);

sd.init(() => {
    sd.Link(u, s1).arrow();
    sd.Link(u, s2).arrow();
    sd.Link(u, s3).arrow();
    const line = new sd.Line(svg)
        .source(u.cx() + 80, u.cy() - 80)
        .target(u.center())
        .arrow();
    sd.trim(line, null, u);
});

sd.main(async () => {});

function makeSubtree(value, x, y) {
    const tri = new sd.Triangle(svg).height(140).width(100).cx(x).y(y);
    const v = new sd.Vertex(svg, value).center(tri.pos("cx", "y"));
    return v;
}
