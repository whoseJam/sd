import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).width(100);

sd.init(() => {
    graph.at(0, 0).newNode(1, "u");
    graph.at(0, 1).newNode(2, "v");
    graph.link(1, 2);
});

sd.main(async () => {
    await sd.pause();
});
