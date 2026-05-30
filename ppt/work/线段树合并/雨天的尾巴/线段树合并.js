import * as sd from "@/sd";
import { mergeArrayOnTree } from "../_/MergeArrayOnTree";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg).x(100).y(20).width(400).layerHeight(80);
const itemColors = [C.RED, C.BLUE, C.GREEN];
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
const buttons = [];
for (let i = 0, y = inputCount.my(); i < itemColors.length; i++) {
    const button = new sd.Button(div)
        .y(y + 10)
        .width(120)
        .text(`加${i + 1}类救济粮`);
    button.onClick(() => add(i));
    y = button.my();
    buttons.push(button);
}
const submit = new sd.Button(div)
    .text("提交")
    .width(120)
    .y(buttons[buttons.length - 1].my() + 10)
    .onClick(() => {
        buttons.forEach(button => button.onClick(null));
        sd.inter(async () => {
            await mergeArrayOnTree(tree, {
                onMergeArray,
            });
        });
    });

async function onMergeArray(u, v) {
    const du = tree.element(u);
    const dv = tree.element(v);
    const au = du.child("arr");
    const av = dv.child("arr");
    await sd.pause();
    const link = sd.Link(av, au).startAnimate().pointStoT().endAnimate().arrow();
    await sd.pause();
    au.forEachElement((element, id) => {
        element
            .startAnimate()
            .value(element.intValue() + av.intValue(id))
            .endAnimate();
    });
    await sd.pause();
    link.startAnimate().fadeStoT().endAnimate().remove();
}

function add(type) {
    const x = +inputX.value();
    const y = +inputY.value();
    const count = +inputCount.value();
    if (x < 1 || x > n) return;
    if (y < 1 || y > n) return;
    if (!(count <= 4 && count >= 1)) return;
    sd.inter(async function () {
        tree.forEachNodeOnPath(x, y, node => {
            const stk = node.child(`stk${type}`);
            stk.startAnimate();
            for (let i = 1; i <= count; i++) stk.push(new sd.Circle(svg).color(itemColors[type]).r(3));
            stk.endAnimate();
            addPath(x, y, count, type);
        });
    });
}

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    tree.forEachNode(node => {
        node.childAs("arr", new sd.Array(node).elementWidth(15).elementHeight(15).resize(itemColors.length), R.aside("tc"));
        for (let i = 0; i < itemColors.length; i++) node.childAs(`stk${i}`, new sd.ValueStack(node).elementWidth(10).elementHeight(10), R.aside("lt", 1 + i * 10));
    });
});

sd.main(async () => {});

function addPath(x, y, d, t) {
    if (x === y) {
        addNode(x, d, t);
        addNode(tree.fatherId(x), -d, t);
    } else {
        const lca = +tree.lcaId(x, y);
        if (lca === y) {
            let tmp = x;
            x = y;
            y = tmp;
        }
        if (lca === x) {
            addNode(y, d, t);
            addNode(tree.fatherId(x), -d, t);
        } else {
            addNode(x, d, t);
            addNode(y, d, t);
            addNode(lca, -d, t);
            addNode(tree.fatherId(lca), -d, t);
        }
    }
}

function addNode(x, d, t) {
    if (!x) return;
    tree.element(x).child("arr").startAnimate().value(t, d).endAnimate();
}
