import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const t = new sd.BinaryTree(svg).width(800).cx(600).y(100);
const expr = "a+b*(c-d)-e/f";
const arr = new sd.Array(svg).start(1).pushArray(expr).cx(600).y(400);
const arr1 = new sd.Array(svg).x(arr.x()).y(450);
const arr2 = new sd.Array(svg).x(arr.x()).y(500);
let id = 0;

sd.init(() => {});

sd.main(async () => {
    await build(1, arr.length(), 0, 0);
    await dfsPreorder(1);
    await sd.pause();
    t.startAnimate().color(C.white).endAnimate();
    await dfsPostorder(1);
});

async function build(l, r, prt, dir) {
    function link(x, y, dir, v) {
        t.startAnimate().freeze().newNode(y, v);
        if (dir === 0) t.leftChild(x, y);
        else t.rightChild(x, y);
        t.unfreeze().endAnimate();
    }
    if (l === r) {
        await sd.pause();
        arr.startAnimate().color(l, C.grey).endAnimate();
        await sd.pause();
        const current = ++id;
        link(prt, current, dir, arr.text(l));
        return;
    }

    let top = 0;
    let op1 = -1;
    let op2 = -1;
    for (let i = l; i <= r; i++) {
        const cur = arr.text(i);
        if (cur === "(") top++;
        if (cur === ")") top--;
        if (top === 0 && (cur === "+" || cur === "-")) op1 = i;
        if (top === 0 && (cur === "*" || cur === "/")) op2 = i;
    }
    if (op1 === -1 && op2 === -1) {
        await sd.pause();
        arr.startAnimate().color(l, C.grey).color(r, C.grey).endAnimate();
        await build(l + 1, r - 1, prt, dir);
        return;
    }
    const current = ++id;
    const op = op1 === -1 ? op2 : op1;
    await sd.pause();
    arr.startAnimate().color(op, C.blue).endAnimate();
    await sd.pause();
    if (!prt) t.startAnimate().root(1, arr.text(op)).endAnimate();
    else link(prt, current, dir, arr.text(op));
    await sd.pause();
    arr.startAnimate().color(op, C.grey).endAnimate();
    await build(l, op - 1, current, 0);
    await build(op + 1, r, current, 1);
}

async function dfsPreorder(u) {
    await sd.pause();
    t.startAnimate();
    t.color(u, C.green);
    t.endAnimate();
    await sd.pause();
    const tv = t.value(u);
    const text = new sd.Text(svg, tv.text()).fontSize(tv.fontSize()).center(tv.center());
    arr1.startAnimate().pushFromExistValue(text).endAnimate();
    if (t.leftChild(u)) await dfsPreorder(t.leftChildId(u));
    if (t.rightChild(u)) await dfsPreorder(t.rightChildId(u));
    await sd.pause();
    t.startAnimate();
    t.color(u, C.grey);
    t.endAnimate();
}

async function dfsPostorder(u) {
    await sd.pause();
    t.startAnimate();
    t.color(u, C.green);
    t.endAnimate();
    if (t.leftChild(u)) await dfsPostorder(t.leftChildId(u));
    if (t.rightChild(u)) await dfsPostorder(t.rightChildId(u));
    await sd.pause();
    const tv = t.value(u);
    const text = new sd.Text(svg, tv.text()).fontSize(tv.fontSize()).center(tv.center());
    arr2.startAnimate().pushFromExistValue(text).endAnimate();
    await sd.pause();
    t.startAnimate();
    t.color(u, C.grey);
    t.endAnimate();
}
