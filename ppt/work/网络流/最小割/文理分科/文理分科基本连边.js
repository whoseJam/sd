import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg);

sd.init(() => {
    graph.at(0.5, 0).newNode("S");
    graph.at(0.5, 0.5).newNode("u");
    graph.at(0.5, 1).newNode("T");
    graph.newLink("S", "u");
    graph.element("S", "u").arrow().value("a", R.pointAtPathByRate(0.5, "cx", "my"));
    graph.newLink("u", "T");
    graph.element("u", "T").arrow().value("s", R.pointAtPathByRate(0.5, "cx", "my"));
});

sd.main(async () => {});
