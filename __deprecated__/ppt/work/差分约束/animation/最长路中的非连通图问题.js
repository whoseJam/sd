import * as sd from "@/sd";
import { SpfaWithoutAnimation } from "./差分约束动画库";

const svg = sd.svg();
const R = sd.rule();
const graph = new sd.GridGraph(svg).height(100).cx(600).cy(300);
const n = 4;
const links = [
    [1, 2, -3, "mx", "cy"],
    [3, 4, -5, "mx", "cy"],
    [1, 4, 6, "cx", "my"],
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
    SpfaWithoutAnimation(graph, "maxDistance");
    for (let i = 1; i <= n; i++) {
        const nodeU = graph.element(i);
        const dis = nodeU.dis;
        const rule = (i <= 2) ? R.aside("lc", 10) : R.aside("rc", 10);
        const text = new sd.Text(nodeU, `dis=${dis}`);
        nodeU.childAs("distance", text, rule).update();
        text.opacity(0).startAnimate().opacity(1).endAnimate();
    }
    await sd.pause();
}