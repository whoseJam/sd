import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const tree = new sd.Tree(svg).x(100).y(100);
const rs = new sd.RoundSquareTree(svg).width(400);
const data = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [3, 6],
    [4, 7],
    [5, 8],
    [6, 9],
    [8, 10],
    [8, 11],
    [11, 12],
];
const squares = [];
for (let i = 1; i <= 7; i++) squares.push(100 + i);

init();
main();

function init() {
    rs.root(1);
    squares.forEach(nodeId => {
        rs.newSquareNode(nodeId, new sd.Math(svg, `R_${nodeId - 100}`));
        rs.element(nodeId).rate(1.5);
    });
    for (let i = 2; i <= 12; i++) rs.newRoundNode(i);
    const links = [
        [1, 101],
        [1, 102],
        [101, 2],
        [101, 4],
        [101, 5],
        [102, 3],
        [4, 103],
        [5, 104],
        [3, 105],
        [103, 7],
        [104, 8],
        [105, 6],
        [105, 9],
        [8, 106],
        [8, 107],
        [106, 10],
        [107, 11],
        [107, 12],
    ];
    links.forEach(link => {
        rs.newLink(link[0], link[1]);
    });

    tree.root(1);
    data.forEach(link => {
        tree.link(link[0], link[1]);
        tree.element(link[0], link[1]).strokeWidth(2);
    });
    sd.Link(tree.element(4), tree.element(1), sd.Curve).bending(-0.5).arrow();
    sd.Link(tree.element(5), tree.element(1)).arrow();
    sd.Link(tree.element(9), tree.element(3), sd.Curve).bending(0.5).arrow();
    sd.Link(tree.element(12), tree.element(8), sd.Curve).bending(-0.15).arrow();

    rs.x(tree.mx() + 100).y(tree.y());
}

async function main() {
    for (let i = 0; i < squares.length; i++) {
        await sd.pause();
        const u = squares[i];
        const adj = rs.children(u).map(u => u.nodeId);
        const fa = rs.father(u).nodeId;
        adj.push(fa);
        tree.startAnimate();
        adj.forEach(v => tree.color(v, C.green));
        tree.endAnimate();
        rs.startAnimate();
        adj.forEach(v => rs.color(v, C.green));
        rs.color(u, C.green);
        rs.endAnimate();
        await sd.pause();
        tree.startAnimate().color(C.white).endAnimate();
        rs.startAnimate().color(C.white).endAnimate();
    }
    await sd.pause();
}
