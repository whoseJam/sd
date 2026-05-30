import * as sd from "@/sd";
import { suffixMachine } from "../_/SuffixMachine";

const svg = sd.svg();
const R = sd.rule();
const tree = new sd.ValueTree(svg).width(300).layerHeight(100);
const graph = new sd.GridGraph(svg).width(100).height(200).cx(150);
const MAXC = 2;
const [fa, ch, len, tot] = suffixMachine("abaab");

sd.init(() => {
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
    graph.uneffectAll();
    tree.freeze();
    tree.newNodeFromExistElement(1, graph.element(1));
    for (let i = 2; i <= tot; i++) {
        tree.newNodeFromExistElement(i, graph.element(i));
        tree.newLink(fa[i], i);
        const link = tree.element(fa[i], i);
        link.opacity(0.2).arrow().strokeDashArray([5, 5]);
        manualLink(link, fa[i], i);
    }
});

sd.main(async () => {
    await sd.pause();
    tree.startAnimate(1000);
    for (let i = 2; i <= tot; i++) {
        tree.element(fa[i], i).opacity(1);
    }
    tree.unfreeze();
    tree.endAnimate();
    graph.links().forEach(link => {
        link.startAnimate(1000);
        link.opacity(0.2);
        manualLink(link, graph.sourceId(link), graph.targetId(link));
        console.log(link.delay(), link.delay() + link.duration());
        link.endAnimate();
    });
});

function manualLink(link, a, b) {
    link.source(graph.element(a).center());
    link.target(graph.element(b).center());
    sd.trim(link, graph.element(a), graph.element(b));
    link.onEnter(null);
}
