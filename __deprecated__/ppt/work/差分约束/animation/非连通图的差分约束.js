import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const graph = new sd.GridGraph(svg).height(100).cx(600).cy(300);
const links = [
    [2, 1, 3, "mx", "cy"],
    [4, 3, 5, "mx", "cy"],
    [4, 1, -6, "cx", "my"],
];

init();
main();

function init() {
    graph.at(0, 0).newNode(1);
    graph.at(1, 0).newNode(2);
    graph.at(1, 1).newNode(3);
    graph.at(0, 1).newNode(4);
    links.forEach(link => {
        graph.newLink(link[0], link[1], link[2]);
        graph.value(link[0], link[1]).fontSize(25);
        graph.element(link[0], link[1]).rule(R.pointAtPathByRate(0.5, link[3], link[4]))
        graph.element(link[0], link[1]).arrow();
    });
}

async function main() {
    await sd.pause();
}