import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).width(150).height(90);

sd.init(() => {
    graph.at(0.5, 0).newNode(1, new sd.Math(graph, "Y_i"));
    graph.at(0.5, 1).newNode(2, new sd.Math(graph, "N_i"));
    graph.element(1).rate(2);
    graph.element(2).rate(2);
    graph.at(0, 0.5).newNode(3, "...");
    graph.at(1, 0.5).newNode(4, "...");
    graph.element(3).strokeOpacity(0);
    graph.element(4).strokeOpacity(0);
    const link = (a, b) => {
        graph.link(a, b);
        graph.element(a, b).arrow();
    };
    link(1, 3);
    link(3, 2);
    link(2, 4);
    link(4, 1);
});

sd.main(async () => {
    await sd.pause();
});
