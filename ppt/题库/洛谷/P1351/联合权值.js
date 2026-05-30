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
    await sd.pause();
    const angle = Math.PI / cnt;
    for (let i = 1; i < cnt; i++) {
        const a = angle * i;
        const p = V.makeComplex(80, a);
        const node1 = new sd.Vertex(svg).center(p).opacity(0).startAnimate().opacity(1).endAnimate();
        sd.Link(m, node1).startAnimate().pointStoT().endAnimate();
        const node2 = new sd.Vertex(svg).cx(p[0]).cy(-p[1]).opacity(0).startAnimate().opacity(1).endAnimate();
        sd.Link(m, node2).startAnimate().pointStoT().endAnimate();
        nodes.push(node1);
        nodes.push(node2);
    }
    await sd.pause();
    nodes.forEach(node => {
        node.startAnimate().strokeWidth(3).stroke(C.red).endAnimate();
    });
});
