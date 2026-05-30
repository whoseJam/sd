import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();

sd.init(() => {
    const t = new sd.HorizontalValueTree(svg).x(100).y(100).layerWidth(100);
    function makeVertex(i) {
        return new sd.Vertex(svg).rate(1.6).value(new sd.Math(svg, `C_{${i}}`));
    }
    t.root(1, makeVertex(1));
    for (let i = 2; i <= 8; i++) {
        t.newNode(i, makeVertex(i));
        t.newLink(i - 1, i);
        t.element(i - 1, i).value(new sd.Text(svg, "lim=S").fontSize(15), R.pointAtPathByRate(0.5, "cx", "my"));
    }
});

sd.main(async () => {});
