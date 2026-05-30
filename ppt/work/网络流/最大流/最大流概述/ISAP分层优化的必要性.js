import * as sd from "@/sd";
import { flowWithRegret } from "../_/FlowWithRegret";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).height(200).cx(600).cy(300);
const R = sd.rule();
const links = [
    [1, 2, 99, "mx", "my"],
    [1, 3, 99, "mx", "y"],
    [2, 3, 1, "x", "cy"],
    [2, 4, 99, "x", "my"],
    [3, 4, 99, "x", "y"],
];

sd.init(() => {
    graph.at(0.5, 0).newNode(1, "A");
    graph.at(0, 0.5).newNode(2, "B");
    graph.at(1, 0.5).newNode(3, "C");
    graph.at(0.5, 1).newNode(4, "D");
    links.forEach(link => {
        const rule = R.pointAtPathByRate(0.5, link[3], link[4]);
        graph.newLink(link[0], link[1]);
        const element = graph.element(link[0], link[1]).arrow();
        element.value(new sd.Math(element, link[2]).fontSize(20), rule);
        element.xlocator = link[3];
        element.ylocator = link[4];
    });
    graph.linkType(sd.Curve);
});

function onReverseLink(u, v) {
    const link = graph.element(u, v);
    return R.pointAtPathByRate(0.5, link.xlocator, link.ylocator);
}

sd.main(async () => {
    for (let i = 1; i <= 3; i++) {
        await flowWithRegret(
            graph,
            [
                { from: 1, to: 2 },
                { from: 2, to: 3 },
                { from: 3, to: 4 },
            ],
            { onReverseLink }
        );
        await flowWithRegret(
            graph,
            [
                { from: 1, to: 3 },
                { from: 3, to: 2 },
                { from: 2, to: 4 },
            ],
            { onReverseLink }
        );
    }
});
