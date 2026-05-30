import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 8;
const arr = new sd.Array(svg).x(100).y(100).elementWidth(60);
sd.Label(arr, "位置", "lc");

sd.init(init);
sd.main(main);

function init() {
    for (let i = 0; i < n; i++) {
        arr.freeze();
        arr.push();
        const e = arr.lastElement();
        e.childAs("segment", makeSegmentTree(), R.aside("tc"));
        e.childAs("math", new sd.Code(svg, `Insert\nBullets\nHit(${i + 1})`).width(40), R.aside("bc"));
        arr.unfreeze();
    }
}

async function main() {
    await query(1, 3);    
}

async function query(l, r) {
    await sd.pause();
    arr.startAnimate().color(l, r, C.green).endAnimate();
    await sd.pause();
    const elementR = arr.element(r);
    elementR.child("segment").startAnimate().color(C.green).endAnimate();
    const elementL = arr.element(l - 1);
    elementL.child("segment").startAnimate().color(C.green).endAnimate();
    // await sd.pause();
    // elementR.startAnimate().color(C.white).endAnimate();
    // elementL.startAnimate().color(C.white).endAnimate();
}

function makeSegmentTree() {
    const tree = new sd.HorizontalValueTree(svg).layerWidth(7).height(50);
    function makeArray(length) {
        return new sd.Stack(tree).elementWidth(5).elementHeight(5).resize(length);
    }
    tree.freeze();
    tree.root(1, makeArray(4));
    tree.newNode(2, makeArray(2)); tree.link(1, 2);
    tree.newNode(3, makeArray(2)); tree.link(1, 3);
    tree.newNode(4, makeArray(1)); tree.link(2, 4);
    tree.newNode(5, makeArray(1)); tree.link(2, 5);
    tree.newNode(6, makeArray(1)); tree.link(3, 6);
    tree.newNode(7, makeArray(1)); tree.link(3, 7);
    tree.unfreeze();
    return tree;
}