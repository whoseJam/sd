import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const fx1 = new sd.Vertex(svg, "fx");
const fy1 = new sd.Vertex(svg, "fy").dx(100);
const x1 = new sd.Vertex(svg, "x").dy(100);
const y1 = new sd.Vertex(svg, "y").dx(100).dy(100);
sd.Link(x1, fx1).value("$dis_x$", R.pointAtPathByRate(0.5, "mx", "cy", -2)).arrow();
sd.Link(y1, fy1).value("$dis_y$", R.pointAtPathByRate(0.5, "x", "cy", 2)).arrow();
sd.Link(x1, y1).value("$d$", R.pointAtPathByRate(0.5, "cx", "y", 0, 2)).arrow();
sd.Link(fx1, fy1).value("$?$", R.pointAtPathByRate(0.5, "cx", "my", 0, -2)).arrow().strokeDashArray([5, 5]);

const fx2 = new sd.Vertex(svg, "fx").dx(300);
const x2 = new sd.Vertex(svg, "x").dx(250).dy(100);
const y2 = new sd.Vertex(svg, "y").dx(350).dy(100);
sd.Link(x2, fx2).value("$dis_x$", R.pointAtPathByRate(0.5, "mx", "cy", -5)).arrow();
sd.Link(y2, fx2).value("$dis_y$", R.pointAtPathByRate(0.5, "x", "cy", 5)).arrow();
sd.Link(x2, y2).value("$d$", R.pointAtPathByRate(0.5, "cx", "y", 0, 2)).arrow();

sd.init(() => {});

sd.main(async () => {});
