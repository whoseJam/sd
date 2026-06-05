import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const x = new sd.Vertex(svg, "x");
const y = new sd.Vertex(svg, "y").dx(120);

sd.init(() => {
    sd.Link(x, y).value("1", R.pointAtPathByRate(0.5, "cx", "y")).arrow();
});

sd.main(async () => {});
