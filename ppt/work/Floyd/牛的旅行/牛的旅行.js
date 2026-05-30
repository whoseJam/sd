import * as sd from "@/sd";

const svg = sd.svg();
const r1 = new sd.Circle(svg).r(50).cx(100).cy(200);
const r2 = new sd.Circle(svg).r(50).cx(300).cy(200);
const v1 = new sd.Vertex(svg, "i").cx(r1.mx()).cy(r1.cy());
const v2 = new sd.Vertex(svg, "j").cx(r2.x()).cy(r2.cy());
const l = sd.Link(v1, v2);
sd.Label(r1, "A", "tc");
sd.Label(r2, "B", "tc");

sd.init(() => {});

sd.main(async () => {});
