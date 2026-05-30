import * as sd from "@/sd";
import { LinkWithNode } from "../_/LinkWithNode";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const graph = new sd.GridGraph(svg);
const stack = new sd.ValueStack(svg).elementHeight(60);
const fa = sd.make1d(100);
const n = 6;
const links = [
    [1, 2, 4, "mx", "my"],
    [2, 4, 2, "x", "cy"],
    [1, 6, 6, "x", "my"],
    [4, 1, 5, "cx", "my"],
    [5, 6, 3, "x", "my"],
    [2, 5, 1, "x", "my"],
    [3, 5, 7, "x", "cy"],
];

sd.init(() => {
    stack.x(graph.mx() + 80).y(graph.y() - 30);
    graph.at(0, 0.5).newNode(1);
    graph.at(0.5, 0).newNode(2);
    graph.at(1, 0.5).newNode(3);
    graph.at(0, 0).newNode(4);
    graph.at(0.5, 0.5).newNode(5);
    graph.at(0.5, 1).newNode(6);
    for (let i = 1; i <= n; i++) fa[i] = i;
    links.forEach(link => {
        const x = link[0];
        const y = link[1];
        const v = link[2];
        stack.push(new LinkWithNode(stack, x, y, v));
        graph.link(x, y);
        graph.element(x, y).value(v, R.pointAtPathByRate(0.5, link[3] || "cx", link[4] || "cy"));
    });
});

sd.main(async () => {
    await sd.pause();
    stack
        .startAnimate()
        .sort((a, b) => {
            return a.intValue() - b.intValue();
        })
        .endAnimate();
    for (let i = 0; i < stack.length(); i++) {
        const link = stack.element(i);
        const x = link.child("x").intValue();
        const y = link.child("y").intValue();

        await sd.pause();
        link.child("x").startAnimate().color(C.red).endAnimate();
        link.child("y").startAnimate().color(C.red).endAnimate();
        graph.startAnimate();
        graph.element(x, y).stroke(C.red).strokeWidth(2);
        graph.element(x).color(C.red);
        graph.element(y).color(C.red);
        graph.endAnimate();

        await sd.pause();
        graph.startAnimate();
        let fx = getFa(x);
        let fy = getFa(y);
        if (fx !== fy) {
            fa[fx] = fy;
            graph.element(x, y).stroke(C.deepSkyBlue);
        } else graph.element(x, y).stroke(C.grey).strokeDashArray([5, 5]);
        graph.element(x).color(C.white);
        graph.element(y).color(C.white);
        graph.endAnimate();
        link.child("x").startAnimate().color(C.grey).endAnimate();
        link.child("y").startAnimate().color(C.grey).endAnimate();
    }
});

function getFa(x) {
    if (fa[x] === x) return x;
    return getFa(fa[x]);
}
