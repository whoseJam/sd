import * as sd from "@/sd";

const svg = sd.svg();
const V = sd.vec();
const v1 = new sd.Vertex(svg, "u");
const v2 = new sd.Vertex(svg, "v").dx(200);

sd.init(() => {
    sd.Link(v1, v2);
})

sd.main(async () => {
    sd.trim(new sd.Line(svg).source(v1.center()).target(V.add(v1.center(), [-30, -40])), v1);
    sd.trim(new sd.Line(svg).source(v1.center()).target(V.add(v1.center(), [-50, 0])), v1);
    sd.trim(new sd.Line(svg).source(v1.center()).target(V.add(v1.center(), [-30, 40])), v1);

    sd.trim(new sd.Line(svg).source(v2.center()).target(V.add(v2.center(), [30, -40])), v2);
    sd.trim(new sd.Line(svg).source(v2.center()).target(V.add(v2.center(), [50, 0])), v2);
    sd.trim(new sd.Line(svg).source(v2.center()).target(V.add(v2.center(), [30, 40])), v2);
})