import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const R = sd.rule();
const n = 8;
const t1 = makeTree(n, function (tree, f, c) {
    if (f) tree.link(f, c);
    else tree.root(c);
});
const t2 = makeTree(n, function (tree, f, c) {
    if (f) {
        tree.newNode(c, "");
        tree.link(f, c);
        tree.element(f, c).opacity(0.3);
    } else tree.root(c, "");
    tree.element(c).opacity(0.3);
}).x(t1.mx() + 80);
const pointer = sd.Pointer(t1, "insert", "t");
const leaves = [];
const input = new sd.Input(div);
const button = new sd.Button(div).text("插入").onClick(() => {
    const i = +input.value();
    if (i < 1 || i > n) return;
    sd.inter(async () => {
        await insert(i);
    });
});
input.childAs(button, R.aside("rc"));
let allocated = 0;

sd.init(() => {
    input.cx((t1.x() + t2.mx()) / 2);
    t1.forEachNode(node => {
        if (!t1.leftChild(node) && !t1.rightChild(node)) leaves.push(node);
    });
});

sd.main(async () => {});

async function insert(i) {
    pointer
        .startAnimate()
        .moveTo(leaves[i - 1])
        .endAnimate();
    await sd.pause();
    function insert(x, l, r) {
        if (!t2.element(x).allocated) {
            t2.startAnimate();
            t2.element(x).value(++allocated);
            t2.element(x).allocated = true;
            t2.element(x).opacity(1);
            if (x > 1) t2.element(x >> 1, x).opacity(1);
            t2.endAnimate();
        }
        if (l === r) return;
        const mid = (l + r) >> 1;
        if (i <= mid) insert(x << 1, l, mid);
        else insert((x << 1) | 1, mid + 1, r);
    }
    insert(1, 1, n);
    await sd.pause();
    pointer.startAnimate().opacity(0).endAnimate();
}

function makeTree(n, callback) {
    const tree = new sd.BinaryTree(svg).width(500);
    function dfs(x, l, r) {
        const mid = (l + r) >> 1;
        callback(tree, x >> 1, x);
        sd.Label(tree.element(x), `[${l},${r}]`, "tc", 15, 1);
        if (l === r) return;
        dfs(x << 1, l, mid);
        dfs((x << 1) | 1, mid + 1, r);
    }
    dfs(1, 1, n);
    return tree;
}
