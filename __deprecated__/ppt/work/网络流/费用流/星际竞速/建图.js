import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const dag = new sd.DAG(svg).width(100).height(100);
const n = 3;
const graph = new sd.GridGraph(svg).width(200).height(250);
const links = [
    [1, 2, "mx", "cy"],
    [1, 3, "cx", "cy"],
    [2, 3, "x", "cy"],
];
const tinyLinks = [];

sd.init(() => {
    dag.x(graph.mx() + 150).cy(graph.cy());
    links.forEach(link => {
        dag.link(link[0], link[1]);
        dag.element(link[0], link[1]).arrow();
    });
    const k = 1 / (n - 1);
    graph.at(0, 0.5).newNode("S");
    graph.at(1, 0.5).newNode("T");
    for (let i = 0; i < n; i++) {
        graph.at(0.33, i * k).newNode(IN(i), i + 1);
        graph.at(0.66, i * k).newNode(OUT(i), i + 1);
        graph.link("S", IN(i)).element("S", IN(i)).arrow();
        graph.link(OUT(i), "T").element(OUT(i), "T").arrow();
        tinyLinks.push(tinyLink(graph.element(OUT(i)), i + 1));
    }
    links.forEach(link => {
        graph
            .link(IN(link[0] - 1), OUT(link[1] - 1))
            .element(IN(link[0] - 1), OUT(link[1] - 1))
            .value(new sd.Math(svg, `w_{${link[0]},${link[1]}}`), R.pointAtPathByRate(0.5, link[2], link[3]))
            .arrow();
    });
});

sd.main(async () => {
    await sd.pause();
    coverLink(tinyLinks[0]);
    coverLink(tinyLinks[2]);
    coverLink(graph.element(IN(0), OUT(1)));
    coverLink(dag.element(1, 2));
    dag.startAnimate().color(C.blue).endAnimate();
});

function coverLink(line) {
    const cover = new sd.Line(svg);
    cover.source(line.source());
    cover.target(line.target());
    cover.stroke(C.red).strokeWidth(3);
    cover.startAnimate().pointStoT().endAnimate().arrow();
    return cover;
}

function tinyLink(vertex, u) {
    const line = new sd.Line(svg)
        .value(new sd.Math(svg, `A_${u}`).fontSize(10), R.pointAtPathByRate(0, "mx", "cy", -2))
        .arrow()
        .source(0, 0)
        .target(15, 0);
    vertex.childAs(line, (parent, child) => {
        child.mx(vertex.cx() - vertex.r());
        child.cy(vertex.cy());
    });
    return line;
}

function OUT(x) {
    return x;
}

function IN(x) {
    return x + n;
}
