import * as sd from "@/sd";
import { build01TrieTreeSync } from "../_/Build01TrieTreeSync";

const svg = sd.svg();
const V = sd.vec();
const C = sd.color();
const R = sd.rule();
const maxl = 3;
const values = [0, 2, 6, 7, 4, 5];
const tree = new sd.BinaryTree(svg).width(400).cx(600).y(100).layerHeight(80);
const pathes = [];

sd.init(() => {
    const data = values.map(value => numberToString(value));
    build01TrieTreeSync(tree, data, {
        onReachEndOfString(u) {
            tree.element(u).stroke(C.red).strokeWidth(2);
        },
    });
});

sd.main(async () => {
    await sd.pause();
    const math = new sd.Math(svg, "{0}{1}{0}")
        .fontSize(25)
        .x(tree.mx())
        .cy(tree.y())
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    await sd.pause();
    math.element(1).startAnimate().color(C.red).endAnimate();
    await sd.pause();
    tree.startAnimate()
        .forEachNodeInSubtree(2, node => drawLeaf(node, C.red, 3))
        .forEachNodeInSubtree(7, node => drawLeaf(node, C.green, 3))
        .endAnimate();
    await sd.pause();
    clearPathes(3);

    await sd.pause();
    math.element(1).startAnimate().color(C.black).endAnimate();
    math.element(2).startAnimate().color(C.red).endAnimate();
    await sd.pause();
    tree.startAnimate()
        .forEachNodeInSubtree(2, node => drawLeafUtill(node, C.red, 2, "1"))
        .forEachNodeInSubtree(7, node => {
            const id = tree.nodeId(node);
            const color = id === "9" || id === "12" ? C.green : C.purple;
            drawLeafUtill(node, color, 2, "1");
        })
        .endAnimate();
});

function clearPathes(t) {
    while (pathes.length > 0) {
        const path = pathes.pop();
        path.startAnimate(t * 300)
            .fadeStoT()
            .endAnimate()
            .remove();
    }
}

function drawLeafUtill(u, color, t, limit) {
    if (tree.leftChild(u) || tree.rightChild(u)) return;
    pathes.push(drawPath(u, color, t, limit));
}

function drawLeaf(u, color, t) {
    if (tree.leftChild(u) || tree.rightChild(u)) return;
    pathes.push(drawPath(u, color, t));
}

function drawPath(u, color, t, limit = undefined) {
    const list = [];
    while (u && tree.nodeId(u) !== limit) {
        list.push(u);
        u = tree.father(u);
    }
    list.reverse();
    const x = color === C.purple ? 1 : 0;
    const pen = new sd.PathPen().MoveTo(V.add(list[0].center(), [x, 0]));
    for (let i = 1; i < list.length; i++) pen.LineTo(V.add(list[i].center(), [x, 0]));
    return new sd.Path(svg)
        .stroke(color)
        .d(pen.toString())
        .startAnimate(t * 300)
        .pointStoT()
        .endAnimate()
        .arrow();
}

function numberToString(v) {
    let ans = "";
    for (let i = 0; i < maxl; i++) {
        const dir = (v >> i) & 1;
        ans = String(dir) + ans;
    }
    return ans;
}
