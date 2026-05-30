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
    }
    links.forEach(link => {
        graph
            .link(IN(link[0] - 1), OUT(link[1] - 1))
            .element(IN(link[0] - 1), OUT(link[1] - 1))
            .arrow();
    });
});

sd.main(async () => {
    await sd.pause();
    coverLink(graph.element(IN(0), OUT(1)));
    coverLink(graph.element(IN(1), OUT(2)));
    coverLink(dag.element(1, 2));
    coverLink(dag.element(2, 3));
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

function OUT(x) {
    return x;
}

function IN(x) {
    return x + n;
}
