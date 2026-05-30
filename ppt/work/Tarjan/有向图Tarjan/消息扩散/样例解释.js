import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.TinyGraph(svg);
const links = [
    [1, 2],
    [2, 1],
    [2, 3],
    [5, 1],
    [5, 4],
    [6, 2],
];

sd.init(() => {
    links.forEach(link => {
        const clazz = link[2] || sd.Line;
        graph.linkType(clazz);
        graph.link(link[0], link[1]);
        graph.element(link[0], link[1]).arrow();
    });
});

sd.main(async () => {});
