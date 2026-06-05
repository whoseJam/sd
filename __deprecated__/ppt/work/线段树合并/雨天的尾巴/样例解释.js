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
const button1 = new sd.Button(div)
    .y(inputCount.my() + 10)
    .width(120)
    .text("加Ⅰ类救济粮");
const button2 = new sd.Button(div)
    .y(button1.my() + 10)
    .width(120)
    .text("加Ⅱ类救济粮");
button1.onClick(() => add(1));
button2.onClick(() => add(2));

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
            for (let i = 1; i <= count; i++) stk.push(new sd.Circle(svg).color(type === 1 ? C.RED : C.BLUE).r(3));
            stk.endAnimate();
        });
    });
}

sd.init(() => {
    tree.root(1);
    links.forEach(link => {
        tree.link(link[0], link[1]);
    });
    tree.forEachNode(node => {
        node.childAs("stk1", new sd.ValueStack(node).elementWidth(10).elementHeight(10), R.aside("lt", 1));
        node.childAs("stk2", new sd.ValueStack(node).elementWidth(10).elementHeight(10), R.aside("lt", 11));
    });
});

sd.main(async () => {});
