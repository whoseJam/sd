import * as sd from "@/sd";
import { 有向图Tarjan } from "../../Tarjan/_/Tarjan";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.BipartiteGraph(svg).cx(600).cy(300);
const text = new sd.Text(svg).x(550).y(450).fontSize(25);
graph._.linkType = sd.Curve;
const n = 4;
const colorList = [C.red, C.blue, C.green, C.purple, C.orange, C.grey];
const relationships = [
    [1, 4],
    [3, 5],
    [1, 6],
    [4, 2],
];

sd.init(() => {
    const another = nodeId => {
        if (nodeId % 2 === 0) return nodeId - 1;
        return nodeId + 1;
    };
    const link = (a, b) => {
        graph.link(a, b);
    };
    for (let i = 1; i <= n; i++) {
        graph.newNode(i * 2 - 1, 0);
        graph.newNode(i * 2, 1);
    }
    relationships.forEach(relation => {
        const a = relation[0];
        const b = relation[1];
        link(a, another(b));
        link(b, another(a));
    });
});

sd.main(async () => {
    const nodesId = [];
    for (let i = 1; i <= n * 2; i++) nodesId.push(i);
    有向图Tarjan(graph, nodesId);
    const links = graph.member.get("links");
    links.forEach(e => e.opacity(0));
    for (let i = 0; i < relationships.length; i++) {
        await sd.pause();
        const relation = relationships[i];
        text.text(`${relation[0]} <-> ${relation[1]}`);
        const e1 = links[i * 2];
        const e2 = links[i * 2 + 1];
        e1.opacity(1).startAnimate().pointStoT().endAnimate().arrow();
        e2.opacity(1).startAnimate().pointStoT().endAnimate().arrow();
    }
    await sd.pause();
    text.startAnimate().opacity(0).endAnimate();
    for (let i = 1; i <= n * 2; i++) {
        const u = graph.findNodeById(i);
        u.startAnimate()
            .color(colorList[u.bel - 1])
            .endAnimate();
    }
    await sd.pause();
});
