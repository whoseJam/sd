import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).width(200).height(150);
const links = [
    // format
    [1, 2, 40],
    [1, 4, 20],
    [2, 4, 20],
    [2, 3, 30],
    [3, 4, 10],
];

sd.init(() => {
    graph.at(0.5, 0).newNode(1);
    graph.at(0, 0.5).newNode(2);
    graph.at(0.5, 1).newNode(3);
    graph.at(1, 0.5).newNode(4);
    links.forEach(link => {
        graph.link(link[0], link[1], link[2]);
        graph.element(link[0], link[1]).arrow();
    });
});

sd.main(async () => {});
