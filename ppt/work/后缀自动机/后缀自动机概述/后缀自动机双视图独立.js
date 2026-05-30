import * as sd from "@/sd";
import { suffixMachine } from "../_/SuffixMachine";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg).width(300).layerHeight(100).x(300);
const graph = new sd.GridGraph(svg).width(100).height(200).cx(150);
const arr = new sd.Array(svg).pushArray("abaab");
const MAXC = 2;
const [fa, ch, len, tot] = suffixMachine("abaab");

sd.init(() => {
    arr.cx(300).y(graph.my() + 80);
    graph.at(0, 0).newNode(1);
    graph.at(0.5, 0).newNode(2);
    graph.at(0, 1).newNode(3);
    graph.at(0.5, 1).newNode(4);
    graph.at(1, 0).newNode(5);
    graph.at(1, 1).newNode(6);

    for (let i = 1; i <= tot; i++) {
        for (let v = 0; v < MAXC; v++) {
            if (ch[i][v]) {
                graph.newLink(i, ch[i][v]);
                graph.element(i, ch[i][v]).arrow();
                const rule = graph.element(i, ch[i][v]).width() <= 5 ? R.pointAtPathByRate(0.5, "x", "cy") : R.pointAtPathByRate(0.5, "cx", "my");
                graph.element(i, ch[i][v]).value(String.fromCharCode(v + "a".charCodeAt(0)), rule);
            }
        }
    }

    tree.root(1);
    for (let i = 2; i <= tot; i++) {
        tree.link(fa[i], i);
        tree.element(fa[i], i).arrow();
    }
    for (let i = 2; i <= tot; i++) {
        const location = tree.element(i).cx() < tree.element(fa[i]).cx() ? "lt" : "rt";
        const stack = new sd.ValueStack(svg).align("mx").elementHeight(20);
        tree.element(i).childAs("stk", stack, R.aside(location));
    }
});

sd.main(async () => {
    for (let u = 2; u <= tot; u++) {
        const paths = [];
        search(1, u, [1], paths);
        paths.sort((pathA, pathB) => {
            return pathA.length - pathB.length;
        });
        await sd.pause();
        graph.startAnimate().color(u, C.blue).endAnimate();
        tree.startAnimate().color(u, C.blue).endAnimate();
        for (let i = 0; i < paths.length; i++) await markPath(u, paths[i]);
        await sd.pause();
        graph.startAnimate().color(u, C.white).endAnimate();
        tree.startAnimate().color(u, C.white).endAnimate();
    }
});

async function markPath(u, path) {
    await sd.pause();
    let timestamp = 0;
    let answer = "";
    const cloned = [];
    for (let i = 0; i < path.length - 1; i++) {
        answer = answer + graph.text(path[i], path[i + 1]);
        const link = graph.element(path[i], path[i + 1]);
        const clone = new sd.Line(svg).opacity(0).stroke(C.red).strokeWidth(2);
        clone.source(link.source()).target(link.target());
        clone.after(timestamp).opacity(1).startAnimate().pointStoT().endAnimate().arrow();
        cloned.push(clone);
        timestamp = clone;
    }
    await sd.pause();
    tree.element(u).child("stk").startAnimate().push(answer).endAnimate();
    await sd.pause();
    timestamp = 0;
    for (let i = 0; i < path.length - 1; i++) {
        cloned[i].after(timestamp).startAnimate().fadeStoT().endAnimate().remove();
        timestamp = cloned[i];
    }
}

function search(u, target, path, paths) {
    if (u === target) {
        paths.push([...path]);
        return;
    }
    for (let i = 0; i < MAXC; i++) {
        if (ch[u][i]) {
            path.push(ch[u][i]);
            search(ch[u][i], target, path, paths);
            path.pop();
        }
    }
}
