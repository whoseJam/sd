import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.BoxDAG(svg).elementWidth(80).height(200).width(200);
const links = [
    [1, 2],
    [2, 3],
    [1, 3],
    [4, 3],
    [3, 5],
    [3, 6],
];

sd.init(() => {
    links.forEach(link => {
        graph.link(label(link[0]), label(link[1]));
        graph.element(label(link[0]), label(link[1])).arrow();
    });
});

sd.main(async () => {});

function label(x) {
    return `航线${x}`;
}
