import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.BipartiteGraph(svg).cx(600).cy(300);
const n = 6;

sd.init(() => {
    const link = (a, b) => {
        graph.link(a, b);
        graph.element(a, b).arrow();
    };
    const Y = a => {
        return a * 2 - 1;
    };
    const N = a => {
        return a * 2;
    };
    for (let i = 1; i <= n; i++) {
        graph.newNode(i * 2 - 1, new sd.Math(graph, `T_${i}`), 0);
        graph.newNode(i * 2, new sd.Math(graph, `F_${i}`), 1);
        graph.element(i * 2 - 1).rate(2.0);
        graph.element(i * 2).rate(2.0);
    }
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if (i === j) continue;
            link(Y(i), N(j));
        }
    }
});

sd.main(async () => {});
