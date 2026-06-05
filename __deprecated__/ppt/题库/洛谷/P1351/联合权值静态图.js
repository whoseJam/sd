import * as sd from "@/sd";

const svg = sd.svg();
const V = sd.vec();
const C = sd.color();
const u = new sd.Vertex(svg, "u").cx(-80).cy(0);
const m = new sd.Vertex(svg, "m").cx(0).cy(0);
const v = new sd.Vertex(svg, "v").cx(80).cy(0);
const cnt = 3;
const nodes = [u, v];

sd.init(() => {
    sd.Link(m, u);
    sd.Link(m, v);
});

sd.main(async () => {
    const angle = Math.PI / cnt;
    for (let i = 1; i < cnt; i++) {
        const a = angle * i;
        const p = V.makeComplex(80, a);
        const node1 = new sd.Vertex(svg).center(p);
        sd.Link(m, node1);
        const node2 = new sd.Vertex(svg).cx(p[0]).cy(-p[1]);
        sd.Link(m, node2);
        nodes.push(node1);
        nodes.push(node2);
    }
    nodes.forEach(node => {
        node.strokeWidth(3).stroke(C.red);
    });
});
