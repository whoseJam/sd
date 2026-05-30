import * as sd from "@/sd";

const svg = sd.svg();
const courseMap = new sd.BoxDAG(svg); // type: Node
const nodes = [0, 1, 2, 3, 4, 5, 6, 7];
const nodesToText = ["高等数学", "程序设计", "离散数学", "数据结构", "编译技术", "操作系统", "普通物理", "数字电路"];
const links = [
    [0, 2],
    [1, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5],
    [7, 5],
    [0, 6],
    [6, 7],
];

sd.init(() => {
    for (let i = 0; i < nodes.length; i++) {
        courseMap.newNode(nodes[i], nodesToText[i]);
        const tmp = courseMap.elementWidth(30); // type: sd.BoxDAG
    }
    for (let i = 0; i < links.length; i++) {
        const x = links[i][0];
        const y = links[i][1];
        courseMap.newLink(x, y);
        courseMap.element(x, y).arrow();
    }
    courseMap.cx(600).cy(300).elementWidth(80);
});

sd.main(async () => {
    await toposort(60);
    await toposort(120);
});

async function toposort(dy) {
    await sd.pause();
    const Q = [];
    const ind = sd.make1d(20);
    links.forEach(link => {
        ind[link[1]]++;
    });
    const n = nodes[nodes.length - 1];
    for (let i = 0; i < n; i++) if (!ind[i]) Q.push(i);
    const seq = [];
    while (Q.length > 0) {
        const idx = sd.rand(0, Q.length - 1);
        const u = Q[idx];
        seq.push(u);
        Q.splice(idx, 1);
        const out = courseMap.outLinks(u, "directed");
        for (let i = 0; i < out.length; i++) {
            const v = courseMap.toNodeId(out[i], u);
            ind[v]--;
            if (!ind[v]) Q.push(v);
        }
    }
    const array = new sd.ValueArray(svg)
        .x(courseMap.cx() - 300)
        .y(courseMap.my() + dy)
        .elementWidth(80);
    for (let i = 0; i < seq.length; i++) {
        const e = courseMap.element(seq[i]);
        const clone = new sd.Box(svg).width(80).value(e.text());
        clone.cx(e.cx()).cy(e.cy());
        array.startAnimate().pushFromExistElement(clone).endAnimate();
    }
}
