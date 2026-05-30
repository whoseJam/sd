import * as sd from "@/sd";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg).x(100).width(400).layerHeight(80);
const n = 5;
const links = [
    [1, 2],
    [1, 3],
    [3, 4],
    [3, 5],
];

const inputX = new sd.Input(div).label("x");
const inputY = new sd.Input(div).y(inputX.my() + 10).label("y");
const inputCount = new sd.Input(div).y(inputY.my() + 10).label("count");
const button = new sd.Button(div)
    .y(inputCount.my() + 10)
    .width(120)
    .text("加救济粮");
button.onClick(() => add());

function add() {
    const x = +inputX.value();
    const y = +inputY.value();
    const count = +inputCount.value();
    if (x < 1 || x > n) return;
    if (y < 1 || y > n) return;
    if (!(count <= 4 && count >= 1)) return;
    sd.inter(async function () {
        tree.forEachNodeOnPath(x, y, node => {
            const stk = node.child("stk");
            stk.startAnimate();
            for (let i = 1; i <= count; i++) stk.push(new sd.Circle(svg).color(C.RED).r(3));
            stk.endAnimate();
        });
        addPath(x, y, count);
    });
}

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    tree.forEachNode(node => {
        node.childAs("stk", new sd.ValueStack(node).elementWidth(10).elementHeight(10), R.aside("lt", 1));
        node.childAs("val", new sd.Math(node, "").fontSize(10), R.aside("bc", 1));
        node.val = 0;
    });
});

sd.main(async () => {});

function addPath(x, y, d) {
    if (x === y) {
        addNode(x, d);
        addNode(tree.fatherId(x), -d);
    } else {
        const lca = +tree.lcaId(x, y);
        if (lca === y) {
            let tmp = x;
            x = y;
            y = tmp;
        }
        if (lca === x) {
            addNode(y, d);
            addNode(tree.fatherId(x), -d);
        } else {
            addNode(x, d);
            addNode(y, d);
            addNode(lca, -d);
            addNode(tree.fatherId(lca), -d);
        }
    }
}

function addNode(x, d) {
    if (!x) return;
    const node = tree.element(x);
    node.val += d;
    const val = node.child("val");
    val.startAnimate();
    if (node.val > 0) val.transformMath(`+${node.val}`);
    else if (node.val === 0) val.transformMath("");
    else val.transformMath(node.val);
    val.endAnimate();
}
