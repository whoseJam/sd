import * as sd from "@/sd";
import { build01TrieTreeSync } from "../../_/Build01TrieTreeSync";

const svg = sd.svg();
const C = sd.color();
const queryValue = 6;
const maxl = 3;
const values = [0, 2, 6, 7];
const tree = new sd.BinaryTree(svg).width(400).cx(600).y(100).layerHeight(80);
const decide = new sd.BinaryTree(svg)
    .width(400)
    .x(tree.mx() + 100)
    .y(100)
    .layerHeight(80);
const valueTables = new sd.Code(svg);

sd.init(() => {
    const data = values.map(value => numberToString(value));
    build01TrieTreeSync(tree, data, {
        onReachEndOfString(u) {
            tree.element(u).stroke(C.red).strokeWidth(2);
        },
    });
    valueTables.fontSize(30);
    valueTables.mx(tree.x() - 50).y(tree.y());
    values.forEach(name => valueTables.push(`${name}:${numberToString(name)}`));
});

sd.main(async () => {
    // const pointer = sd.Pointer(svg, "cur", "r", 40);
    let tot = 1;
    await sd.pause();
    decide.startAnimate().root(1, math(queryValue)).endAnimate();
    let current = [[1, 1, queryValue]];
    for (let i = maxl - 1; i >= 0; i--) {
        let next = [];
        for (let j = 0; j < current.length; j++) {
            const [decideId, treeId, value] = current[j];
            if (tree.leftChild(treeId)) {
                await sd.pause();
                cover(tree.element(treeId, tree.leftChildId(treeId)));
                await sd.pause();
                decide.startAnimate().freeze();
                decide.newNode(tot + 1, math(value));
                decide.leftChild(decideId, tot + 1);
                decide.unfreeze().endAnimate();
                next.push([++tot, tree.leftChildId(treeId), value]);
            }
            if (tree.rightChild(treeId)) {
                await sd.pause();
                cover(tree.element(treeId, tree.rightChildId(treeId)));
                await sd.pause();
                decide.startAnimate().freeze();
                decide.newNode(tot + 1, math(value ^ (1 << i)));
                decide.rightChild(decideId, tot + 1);
                decide.unfreeze().endAnimate();
                next.push([++tot, tree.rightChildId(treeId), value ^ (1 << i)]);
            }
        }
        current = next;
    }
});

function cover(link) {
    const c = new sd.Line(svg).source(link.source()).target(link.target());
    c.stroke(C.red).strokeWidth(3).startAnimate().pointStoT().endAnimate().arrow();
}

function math(v) {
    return new sd.Math(svg, numberToString(v));
}

function numberToString(v) {
    let ans = "";
    for (let i = 0; i < maxl; i++) {
        const dir = (v >> i) & 1;
        ans = String(dir) + ans;
    }
    return ans;
}
