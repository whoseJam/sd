import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const tree = new sd.Tree(svg);
const valueBoard = new sd.Math(svg);
const focus = sd.Focus(svg);
const n = 6;
const people = [
    [1, 4],
    [2, 6],
    [3, 1],
    [1, 5],
    [3, 3],
];
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [3, 6],
];

sd.init(() => {
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    for (let i = 1; i <= n; i++) {
        tree.element(i).childAs("arr", new sd.Array(svg).elementWidth(12).elementHeight(12), R.aside("tl"));
    }
    people.forEach(p => {
        const [at, v] = p;
        tree.element(at).child("arr").push(v);
    });
    tree.forEachNode((node, nodeId) => {
        node.child("arr").forEachElement(element => {
            element.onClick(elementCallback.bind(element, nodeId, node.child("arr")));
        });

        node.onClick(() => {
            if (!focus.hsj) return;
            if (focus.hsj.nodeId !== tree.fatherId(node)) return;
            sd.inter(async () => {
                const [_nodeId, _arrayId] = [focus.hsj.nodeId, focus.hsj.arrayId];
                focus.startAnimate().focus(null).endAnimate();
                focus.hsj = undefined;
                const box = tree.element(_nodeId).child("arr").startAnimate().dropElement(_arrayId).endAnimate();
                node.child("arr").startAnimate().pushFromExistElement(box).endAnimate();
                box.onClick(elementCallback.bind(box, nodeId, node.child("arr")));
                valueBoard.startAnimate().transformMath(`value={${calculateValue()}}`).endAnimate();
            });
        });
    });
    valueBoard
        .math(`value={${calculateValue()}}`)
        .cx(tree.cx())
        .y(tree.my() + 40);
});

sd.main(async () => {});

function calculateValue() {
    let sum = 0;
    tree.forEachNode(node => {
        let max = 0;
        node.child("arr").forEachElement(element => {
            max = Math.max(max, element.intValue());
        });
        sum += max;
    });
    return sum;
}

function elementCallback(nodeId, array) {
    const arrayId = array.indexOf(this);
    sd.inter(async () => {
        if (focus.hsj && focus.hsj.nodeId === nodeId && focus.hsj.arrayId === arrayId) {
            focus.startAnimate().focus(null).endAnimate();
            focus.hsj = undefined;
        } else {
            focus.startAnimate().focus(this).endAnimate();
            focus.hsj = {
                nodeId,
                arrayId,
            };
        }
    });
}
