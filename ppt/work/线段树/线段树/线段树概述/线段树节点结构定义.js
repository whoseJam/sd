import * as sd from "@/sd";
import { SegmentTree } from "../_/SegmentTree";

const svg = sd.svg();
const R = sd.rule();
const n = 4;
const arr = [1, 2, 3, 1];
const tree = new SegmentTree(svg, 1, n).layerHeight(90);
const focus = sd.Focus(tree);
const lc = x => x * 2;
const rc = x => x * 2 + 1;

sd.init(() => {
    tree.forEachNode(node => {
        const l = node.start();
        const r = node.end();
        node.childAs("lr", new sd.Text(node, `l=? r=?`), R.aside("tc", 18));
        node.childAs("sm", new sd.Text(node, "sm=?"), R.aside("tc", 0));
    });
});

sd.main(async () => {
    await build(1, 1, n);
});

async function build(x, l, r) {
    await sd.pause();
    const node = tree.element(x);
    focus.startAnimate().focus(node).endAnimate();
    node.child("lr").startAnimate().text(`l=${l} r=${r}`).endAnimate();
    if (l === r) {
        await sd.pause();
        node.startAnimate();
        node.value(l, arr[l - 1]);
        node.child("sm").text(`sm=${arr[l - 1]}`);
        node.endAnimate();
        return;
    }
    const mid = (l + r) >> 1;
    await build(lc(x), l, mid);
    await sd.pause();
    focus.startAnimate().focus(node).endAnimate();
    await build(rc(x), mid + 1, r);
    await sd.pause();
    focus.startAnimate().focus(node).endAnimate();

    await sd.pause();
    let sum = 0;
    for (let i = l; i <= r; i++) sum += arr[i - 1];
    node.startAnimate();
    node.child("sm").text(`sm=${sum}`);
    const lchild = tree.element(lc(x));
    const rchild = tree.element(rc(x));
    for (let i = lchild.start(); i <= lchild.end(); i++) {
        const text = lchild.value(i);
        const text_ = new sd.Text(svg, text.text()).fontSize(text.fontSize()).center(text.center());
        node.element(i).valueFromExist(text_);
    }
    for (let i = rchild.start(); i <= rchild.end(); i++) {
        const text = rchild.value(i);
        const text_ = new sd.Text(svg, text.text()).fontSize(text.fontSize()).center(text.center());
        node.element(i).valueFromExist(text_);
    }
    node.endAnimate();
}
