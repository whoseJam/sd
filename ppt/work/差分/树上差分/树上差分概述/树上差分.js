import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg).width(600);
const n = 12;
const links = [
    [1, 2], [1, 3],
    [2, 4], [2, 5],
    [4, 6], [4, 7],
    [6, 8], [6, 9],
    [7, 10], [9, 11], [10, 12]
];

init();
main();

function init() {
    tree.freeze();
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    for (let i = 1; i <= n; i++) {
        const node = tree.element(i);
        node.childAs("token", new sd.Stack(node).elementWidth(10).elementHeight(10), R.aside("lt"));
        node.onClick(() => {
            addCurrentToRoot(i, "push");
        });
        node.onDblClick(() => {
            addCurrentToRoot(i, "pop");
        })
    }
    tree.cx(600).cy(300);
    tree.unfreeze();
}

async function main() {
    await sd.pause();
}

async function addCurrentToRoot(u, type = "push") {
    await sd.pause();
    while (u) {
        const nodeU = tree.element(u);
        tree.startAnimate();
        if (type === "push") {
            nodeU.child("token").push().color(C.BLUE);
        } else {
            nodeU.child("token").pop();
        }
        tree.endAnimate();
        u = nodeU.parentNodeId;
    }
}