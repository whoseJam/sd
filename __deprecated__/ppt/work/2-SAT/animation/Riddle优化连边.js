import * as sd from "@/sd";

const svg = sd.svg();
const graph = new sd.GridGraph(svg).cx(600).cy(300).n(1).m(1);
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
    const Pre = a => {
        return a + 2 * n;
    };
    const Suf = a => {
        return a + 3 * n;
    };
    const P = pos => {
        return (1 / (n - 1)) * (pos - 1);
    };
    for (let i = 1; i <= n; i++) {
        graph.at(0, P(i)).newNode(i * 2 - 1, new sd.Math(graph, `T_${i}`));
        graph.at(1, P(i)).newNode(i * 2, new sd.Math(graph, `F_${i}`));
        graph.at(0.33, P(i)).newNode(Pre(i), new sd.Math(graph, `P_${i}`));
        graph.at(0.66, P(i)).newNode(Suf(i), new sd.Math(graph, `S_${i}`));
        graph.element(i * 2 - 1).rate(2.0);
        graph.element(i * 2).rate(2.0);
        graph.element(Pre(i)).rate(2.0);
        graph.element(Suf(i)).rate(2.0);
    }
    for (let i = 1; i <= n; i++) {
        if (i - 1 >= 1) link(Pre(i), Pre(i - 1));
        if (i + 1 <= n) link(Suf(i), Suf(i + 1));
    }
    graph._.linkType = sd.Curve;
    for (let i = 1; i <= n; i++) {
        link(Pre(i), N(i));
        link(Suf(i), N(i));
    }
});

sd.main(async () => {
    await sd.pause();
});
