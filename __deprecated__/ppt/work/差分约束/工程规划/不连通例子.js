import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();

const graph = new sd.GridGraph(svg).width(300).height(150).cx(600).cy(300);
const n = 4;
const nodes = ["lc", "tc", "bc", "rc"];
const links = [
    [1, 2, 4, "mx", "my"],
    [3, 2, -1, "x", "cy"],
    [4, 3, 2, "x", "y"]
];

function init() {
    graph.at(0.5, 0).newNode(1);
    graph.at(0, 0.5).newNode(2);
    graph.at(1, 0.5).newNode(3);
    graph.at(0.5, 1).newNode(4);
    links.forEach(link => {
        graph.newLink(link[0], link[1]);
        graph.element(link[0], link[1]).value(link[2], R.pointAtPathByRate(0.5, link[3], link[4])).arrow();
    })
}

init();
main();

async function main() {
    const dis = SPFA(1);
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        const str = dis[i] === Infinity ? "inf" : dis[i];
        sd.Label(graph.element(i), `dis=${str}`, nodes[i-1])
            .opacity(0).startAnimate().opacity(1).endAnimate();
    }
    await sd.pause();
}

function SPFA(S) {
    const Q = [S];
    const dis = sd.make1d(50, Infinity);
    const inq = sd.make1d(50);
    dis[S] = 0; inq[S] = 1;
    while (Q.length > 0) {
        const u = Q[0]; Q.shift(); inq[u] = 0;
        const outs = graph.outLinks(u, "direct");
        outs.forEach(link => {
            const v = graph.toNodeId(u, link);
            if (dis[v] > dis[u] + link.intValue()) {
                dis[v] = dis[u] + link.intValue();
                if (!inq[v]) {
                    inq[v] = 1;
                    Q.push(v);
                }
            }
        })
    }
    return dis;
}
