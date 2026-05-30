import * as sd from "@/sd";
import { SpfaWithoutAnimation } from "./差分约束动画库";

const svg = sd.svg();
const R = sd.rule();
const graph1 = new sd.GridGraph(svg).height(0).width(300).cx(300).cy(300).m(3);
const graph2 = new sd.GridGraph(svg).height(0).width(300).cx(800).cy(300).m(3);
const n = 4;
const locator = { 1: "bc", 2: "tc", 3: "bc", 4: "tc" };
const links = [
    [1, 2, 1, "cx", "my"],
    [2, 3, 1, "cx", "my"],
    [3, 4, 1, "cx", "my"],
];

init();
main();

function init() {
    function initGraph(graph) {
        graph.at(0, 0).newNode(1);
        graph.at(0, 1).newNode(2);
        graph.at(0, 2).newNode(3);
        graph.at(0, 3).newNode(4);
        const linkTo = (a, b, v, locx, locy) => {
            graph.newLink(a, b, v);
            graph.value(a, b).fontSize(25);
            graph.element(a, b).rule(R.pointAtPathByRate(0.5, locx, locy));
            graph.element(a, b).arrow();
            return graph.element(a, b);
        }
        links.forEach(link => {
            linkTo(link[0], link[1], link[2], link[3], link[4]);
        });
        graph._.linkType = sd.Curve;
        linkTo(1, 3, 1, "cx", "my").bending(-0.8);
        linkTo(2, 4, 1, "cx", "y").bending(0.8);
    }
    initGraph(graph1);
    initGraph(graph2);
}

async function main() {
    await sd.pause();
    function solveDistance(graph, mode, S) {
        SpfaWithoutAnimation(graph, mode, S);
        for (let i = 1; i <= n; i++) {
            const nodeU = graph.element(i);
            const dis = nodeU.dis;
            const rule = R.aside(locator[i], 5);
            const text = new sd.Text(nodeU, `dis=${dis}`);
            nodeU.childAs("distance", text, rule).update();
            text.opacity(0).startAnimate().opacity(1).endAnimate();
        }
    }
    solveDistance(graph1, "minDistance", 1);
    solveDistance(graph2, "minDistance");
    await sd.pause();
}