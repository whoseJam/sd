import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).height(100).width(400).cx(600).cy(300);
const links = [
    ["+3", "-2"],
    ["-2", "+5"],
    ["+5", "-4"],
];

sd.init(() => {
    graph.at(0, 0.33).newNode("+3");
    graph.at(1, 0.33).newNode("+5");
    graph.at(0, 0.66).newNode("-2");
    graph.at(1, 0.66).newNode("-4");
    links.forEach(link => {
        graph.link(link[0], link[1]);
        graph.element(link[0], link[1]).arrow();
    });
});

sd.main(async () => {});
