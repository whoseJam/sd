import * as sd from "@/sd";

const svg = sd.svg();
const tree = new sd.BinaryTree(svg).width(500).cx(600).cy(300);
const instr = new sd.Text(svg, `Ask id = ${7}`);
const focus = sd.Focus(tree);
const data = [
    [1, 12, "Az"],
    [2, 6, "By"],
    [3, 23, "Ct"],
    [4, 3, "Tg"],
    [5, 8, "Rr"],
    [6, 18, "Tz"],
    [7, 25, "Ed"],
    [8, 1, "Qa"],
    [9, 5, "Fx"],
    [10, 7, "Ze"],
    [11, 9, "Ro"],
    [12, 29, "Ou"],
];
const links = [
    { x: 1, lc: 2, rc: 3 },
    { x: 2, lc: 4, rc: 5 },
    { x: 3, lc: 6, rc: 7 },
    { x: 4, lc: 8, rc: 9 },
    { x: 5, lc: 10, rc: 11 },
    { x: 7, rc: 12 },
];

sd.init(() => {
    tree.root(1, 12);
    for (let i = 1; i < data.length; i++) tree.newNode(data[i][0], data[i][1]);
    data.forEach(item => {
        const node = tree.element(item[0]);
        sd.Label(node, item[2], "tc", 20, 4);
    });
    links.forEach(link => {
        const x = link.x;
        if (link.lc) tree.leftChild(x, link.lc);
        if (link.rc) tree.rightChild(x, link.rc);
    });
    instr.x(400).y(tree.root().y());
});

sd.main(async () => {
    await find(1, 7);
});

async function find(x, value) {
    await sd.pause();
    focus.startAnimate().focus(x).endAnimate();
    const curValue = tree.intValue(x);
    if (curValue === value) return;
    if (curValue > value) await find(tree.leftChildId(x), value);
    else await find(tree.rightChildId(x), value);
}
