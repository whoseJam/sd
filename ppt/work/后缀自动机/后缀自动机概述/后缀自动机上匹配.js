import * as sd from "@/sd";
import { buildSuffixMachineWithLabel } from "../_/BuildSuffixMachineWithLabel";
import { suffixMachine } from "../_/SuffixMachine";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg).width(300).layerHeight(100).x(300);
const graph = new sd.GridGraph(svg).width(100).height(200).cx(150);
const str = "abaab";
const arr = new sd.Array(svg).pushArray(str);
const MAXC = 2;
const [fa, ch, len, tot] = suffixMachine(str);
const nodeLayout = {
    1: [0, 0],
    2: [0.5, 0],
    3: [0, 1],
    4: [0.5, 1],
    5: [1, 0],
    6: [1, 1],
};

sd.init(async () => {
    arr.cx(300).y(graph.my() + 80);
    await buildSuffixMachineWithLabel(graph, tree, str, MAXC, {
        onCreateNewNodeOnGraph,
    });
});

function onCreateNewNodeOnGraph(u) {
    const layout = nodeLayout[u];
    graph.at(layout[0], layout[1]).newNode(u);
}

sd.main(async () => {
    const cur = sd.Pointer(arr, "cur", "b", 5, 20, 5);
    let u = 1;
    await sd.pause();
    const focus = sd.Focus(graph).startAnimate().focus(1).endAnimate();
    for (let i = 1; i <= 3; i++) {
        await sd.pause();
        cur.startAnimate().moveTo(i).endAnimate();
        arr.startAnimate().color(i, C.blue).endAnimate();
        await sd.pause();
        u = ch[u][arr.value(i).text().charCodeAt(0) - "a".charCodeAt(0)];
        focus.startAnimate().focus(u).endAnimate();
    }
});
