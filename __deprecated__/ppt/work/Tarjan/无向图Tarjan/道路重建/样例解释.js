import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).width(300).height(120);
const links = [
    [1, 2],
    [2, 3],
    [3, 4],
    [2, 5],
    [4, 5],
    [5, 6],
    [5, 7],
];

sd.init(() => {
    graph.at(0, 0.33).newNode(6);
    graph.at(0, 0.66).newNode(5);
    graph.at(0, 1).newNode(7);
    graph.at(1, 0).newNode(1);
    graph.at(1, 0.33).newNode(2);
    graph.at(1, 0.66).newNode(3);
    graph.at(1, 1).newNode(4);
    links.forEach(link => {
        graph.link(link[0], link[1]);
    });
});

sd.main(async () => {
    await sd.pause();
    sd.Link(graph.element(1), graph.element(6)).strokeDashArray([5, 5]).opacity(0).startAnimate().opacity(1).endAnimate();
    sd.Link(graph.element(7), graph.element(4)).strokeDashArray([5, 5]).opacity(0).startAnimate().opacity(1).endAnimate();
});
