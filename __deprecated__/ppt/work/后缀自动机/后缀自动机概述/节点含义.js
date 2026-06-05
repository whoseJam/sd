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
    const focus = sd.Focus(svg);
    for (let u = tot; u >= 2; u--) {
        const stk = tree.element(u).child("stk");
        await sd.pause();
        graph.startAnimate().color(u, C.blue).endAnimate();
        tree.startAnimate().color(u, C.blue).endAnimate();
        arr.startAnimate();
        const braces = [];
        findAllRightPosition(str, stk.element(0).text()).forEach(pos => {
            arr.color(pos, C.red);
            braces.push(sd.Brace(arr));
            braces[braces.length - 1].rightPos = pos;
        });
        arr.endAnimate();
        for (let i = 0; i < stk.length(); i++) {
            await sd.pause();
            focus.startAnimate().focus(stk.element(i)).endAnimate();
            braces.forEach(brace => {
                brace
                    .startAnimate()
                    .brace(brace.rightPos - stk.element(i).text().length + 1, brace.rightPos)
                    .endAnimate();
            });
        }
        await sd.pause();
        sd.Aside(tree.element(u), createEndposSet(findAllRightPosition(str, stk.element(0).text())), "tc", 10)
            .opacity(0)
            .startAnimate()
            .opacity(1);
        await sd.pause();
        braces.forEach(brace => {
            brace.startAnimate().opacity(0).endAnimate().remove();
        });
        graph.startAnimate().color(u, C.white).endAnimate();
        tree.startAnimate().color(u, C.white).endAnimate();
        arr.startAnimate().color(C.white).endAnimate();
        focus.startAnimate().focus(null).endAnimate();
    }
});

function findAllRightPosition(str, substr) {
    const pos = [];
    for (let i = 0; i + substr.length <= str.length; i++) {
        if (str.slice(i, i + substr.length) === substr) {
            pos.push(i + substr.length - 1);
        }
    }
    return pos;
}

function createEndposSet(positions) {
    const arr = new sd.Array(svg).elementWidth(10).elementHeight(10).resize(str.length);
    positions.forEach(pos => arr.color(pos, C.red));
    return arr;
}
