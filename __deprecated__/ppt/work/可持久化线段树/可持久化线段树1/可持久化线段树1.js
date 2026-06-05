import * as sd from "@/sd";

import { BuildFromSequence } from "../_/BuildFromSequence";
import { InsertBaseOn } from "../_/InsertBaseOn";
import { WalkOnTree } from "../_/WalkOnTree";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const EN = sd.enter();
const n = 4;
const focus = sd.Focus(svg);
focus.path = [];
let tot = 0;

const initData = [0, 3, 2, 4, 1];
const operator = [
    { pos: 1, value: 1, gap: 300 },
    { pos: 2, value: 3, gap: 200 },
    { pos: 3, value: 2, gap: 100 },
    { pos: 4, value: 3, gap: 100 },
];
const trees = [];

sd.init(async () => {
    trees.push(
        await BuildFromSequence(initData, {
            OnNewNode: OnNewNode,
            OnTreeCreated: tree => tree.x(100).y(100).layerHeight(130),
            OnCreateValueAtLeaf: OnCreateValueAtLeaf,
        })
    );
});

sd.main(async () => {
    for (let i = 0; i < operator.length; i++) {
        const tree = await InsertBaseOn(trees[i], n, operator[i].pos, operator[i].value, {
            OnNewNode: OnNewNode,
            OnTreeCreated: tree =>
                tree
                    .x(trees[i].x() + operator[i].gap)
                    .y(100)
                    .layerHeight(130),
            OnHistoryLeftChildLink: OnHistoryLeftChildLink,
            OnHistoryRightChildLink: OnHistoryRightChildLink,
            VirtualRightChild: true,
            OnCreateValueAtLeaf: OnCreateValueAtLeaf,
        });
        trees.push(tree);

        global.arr = new sd.Array(svg).x((1062.5 + 137.5) / 2 - 80).y(450);
        await WalkOnTree(tree, {
            OnEnterNode: OnEnterNode,
            OnEnterVirtualNode: OnEnterNode,
            OnEnterLeaf: OnEnterLeaf,
            OnExitNode: OnExitNode,
            OnExitVirtualNode: OnExitNode,
        });
        await sd.pause();
        trees.forEach(tree => tree.startAnimate().color(C.white).endAnimate());
        global.arr.startAnimate().opacity(0).endAnimate().remove();
    }
});

function OnNewNode() {
    return ++tot;
}

function OnCreateValueAtLeaf(tree, node, value) {
    node.childAs("v", new sd.Text(svg, `v=${value}`), R.aside("bc", 10));
    node.child("v").v = value;
}

async function OnHistoryLeftChildLink(a, b) {
    sd.Link(a, b, sd.Curve).bending(0).stroke(C.textBlue).startAnimate().pointStoT().endAnimate().arrow();
}

async function OnHistoryRightChildLink(a, b) {
    sd.Link(a, b, sd.Curve).stroke(C.red).startAnimate().pointStoT().endAnimate().arrow();
}

async function OnEnterNode(tree, node) {
    await sd.pause();
    focus.startAnimate().focus(node).endAnimate();
    focus.path.push(node);
    node.startAnimate().color(C.blue).endAnimate();
}

async function OnExitNode(tree, node) {
    await sd.pause();
    focus.path.pop();
    if (focus.path.length > 0)
        focus
            .startAnimate()
            .focus(focus.path[focus.path.length - 1])
            .endAnimate();
    else focus.startAnimate().focus(null).endAnimate();
}

async function OnEnterLeaf(tree, node) {
    await sd.pause();
    global.arr.startAnimate().push(node.child("v").v).endAnimate();
}
