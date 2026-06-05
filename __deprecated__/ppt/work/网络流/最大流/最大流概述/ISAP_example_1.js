import * as sd from "@/sd";
import { flowWithRegret } from "../_/FlowWithRegret";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg).height(200).cx(600).cy(300);
const S = "1";
const T = "4";
const n = 4;
const gap = sd.make1d(10, 0);
const nodes = [
    [1, "lc"],
    [2, "tc"],
    [3, "bc"],
    [4, "rc"],
];
const links = [
    [1, 2, 99, "mx", "my"],
    [1, 3, 99, "mx", "y"],
    [2, 3, 1, "x", "cy"],
    [2, 4, 99, "x", "my"],
    [3, 4, 99, "x", "y"],
];
let earlyFinish = false;

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
    nodes.forEach(node => {
        const element = graph.element(node[0]);
        const label = new sd.Text(element, "dis=0");
        element.dis = 0;
        element.childAs("label", label, R.aside(node[1]));
    });
    const dS = graph.element(S);
    while (dS.dis < n && !earlyFinish) {
        await stream(graph, S, Infinity);
        await sd.pause();
        for (let i = 1; i <= n; i++) {
            const v = graph.element(i);
            const dis = v.child("label");
            const lastDis = +dis.text().slice(4, -1);
            const curDis = +v.dis;
            if (lastDis !== curDis) {
                dis.startAnimate().opacity(0).endAnimate();
                dis.text(`dis=${curDis}`);
                dis.startAnimate().opacity(1).endAnimate();
            }
        }
    }
});

const path = [];
async function stream(graph, u, lim) {
    let give = 0;
    if (String(u) === T) {
        await flowWithRegret(graph, path, { onReverseLink, textGap: 60 });
        return lim;
    } else {
        const du = graph.element(u);
        const outLinks = graph.outLinks(u, "direct");
        for (let i = 0; i < outLinks.length; i++) {
            const link = outLinks[i];
            const v = graph.toNodeId(link, u);
            const dv = graph.element(v);
            if (link.intValue() > 0 && dv.dis + 1 === du.dis) {
                path.push({ from: u, to: v });
                const d = await stream(graph, v, Math.min(lim, link.intValue()));
                give += d;
                lim -= d;
                path.pop();
                if (graph.element(S).dis === n || !lim || earlyFinish) return give;
            }
        }
        if (!--gap[du.dis]) earlyFinish = true;
        gap[++du.dis]++;
        return give;
    }
}
