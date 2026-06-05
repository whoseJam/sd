import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();

const graph = new sd.GridGraph(svg).width(150).height(150).cx(600).cy(300);
const links = [
    [1, 2, 2, "mx", "cy"],
    [2, 3, -3, "cx", "y"],
    [3, 4, -1, "x", "cy"],
    [4, 1, 1, "cx", "my"],
];

function init() {
    graph.at(0, 0).newNode(1);
    graph.at(1, 0).newNode(2);
    graph.at(1, 1).newNode(3);
    graph.at(0, 1).newNode(4);
    links.forEach(link => {
        graph.newLink(link[0], link[1]);
        graph.element(link[0], link[1]).value(link[2], R.pointAtPathByRate(0.5, link[3], link[4])).arrow();
    })
}

init();
main();

async function main() {
    await sd.pause();
}
