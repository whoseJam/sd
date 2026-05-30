import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).height(100).width(400).cx(600).cy(300);
const R = sd.rule();
const links = [
    ["S", "+3", "3", "mx", "my"],
    ["S", "+5", "5", "mx", "y"],
    ["+3", "-2", "\\infty", "cx", "my"],
    ["-2", "+5", "\\infty", "mx", "my"],
    ["+5", "-4", "\\infty", "cx", "y"],
    ["-2", "T", "2", "x", "my"],
    ["-4", "T", "4", "x", "y"],
];

sd.init(() => {
    graph.at(0.5, 0).newNode("S");
    graph.at(0, 0.33).newNode("+3");
    graph.at(1, 0.33).newNode("+5");
    graph.at(0, 0.66).newNode("-2");
    graph.at(1, 0.66).newNode("-4");
    graph.at(0.5, 1).newNode("T");
    links.forEach(link => {
        graph.link(link[0], link[1]);
        const e = graph.element(link[0], link[1]).arrow();
        e.value(new sd.Math(e, link[2]), R.pointAtPathByRate(0.5, link[3] || "cx", link[4] || "cy"));
    });
});

sd.main(async () => {});
