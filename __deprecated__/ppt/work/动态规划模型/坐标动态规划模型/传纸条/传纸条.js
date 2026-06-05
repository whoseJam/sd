import * as sd from "@/sd";

// bug

let svg = sd.svg();

const H = 60;
let g = new sd.Grid(svg).x(100).y(100).n(5).m(5).startN(1).startM(1);
g.elementWidth(H).elementHeight(H);
let x1 = 3,
    y1 = 3,
    m1,
    m1_;
let x2 = 2,
    y2 = 4,
    m2,
    m2_;

g.value(x1, y1, (m1 = new sd.Math(svg, `x_1,y_1`)));
g.value(x2, y2, (m2 = new sd.Math(svg, `x_2,y_2`)));
// sd.MathLabel(g, `x_1=${x1}\\ y_1=${y1}\\ x_2=${x2}\\ y_2=${y2}`, "bc");
sd.Index(g, "t");
sd.Index(g, "l");

g.value(x1, y1 + 2, (m1_ = new sd.Math(svg, `x'_1,y'_1`)));
g.value(x2 + 2, y2, (m2_ = new sd.Math(svg, `x'_2,y'_2`)));
sd.Link(m1, m1_, sd.Curve).arrow();
sd.Link(m2, m2_, sd.Curve).arrow();
