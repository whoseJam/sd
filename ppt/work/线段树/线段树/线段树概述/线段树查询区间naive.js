import * as sd from "@/sd";
import { rangeSelectNaive, SegmentTree } from "../_/SegmentTree";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const n = 8;
const tree = new SegmentTree(svg, 1, n);
const array = new sd.Array(svg)
    .resize(n)
    .start(1)
    .cx(tree.cx())
    .y(tree.my() + 80);
const pQL = sd.Pointer(array, "ql", "t");
const pQR = sd.Pointer(array, "qr", "t");
const pL = sd.Pointer(array, "l", "b");
const pR = sd.Pointer(array, "r", "b");
const focus = sd.Focus(array);

sd.init(() => {});

sd.main(async () => {
    await query(2, 7);
    await query(3, 8);
    await query(1, 6);
});

async function query(ql, qr) {
    await sd.pause();
    array.startAnimate();
    pQL.moveTo(ql);
    pQR.moveTo(qr);
    array.endAnimate();
    await rangeSelectNaive(tree, ql, qr, {
        async onEnter(x, l, r) {
            await sd.pause();
            const element = tree.element(x);
            element.startAnimate().color(C.blue).endAnimate();
            array.startAnimate();
            focus.focus(l, r);
            pL.moveTo(l);
            pR.moveTo(r);
            array.endAnimate();
        },
        async onSelect(x, l, r) {
            await sd.pause();
            const element = tree.element(x);
            element.startAnimate().color(C.orange).endAnimate();
            array.startAnimate().color(l, r, C.orange).endAnimate();
        },
        async onFail(x, l, r) {
            await sd.pause();
            const element = tree.element(x);
            element.startAnimate().color(C.red).endAnimate();
        },
        async onExit(x, l, r) {
            await sd.pause();
            array.startAnimate();
            focus.focus(l, r);
            pL.moveTo(l);
            pR.moveTo(r);
            array.endAnimate();
        },
    });
    await sd.pause();
    array.startAnimate();
    focus.focus(null);
    pQL.moveTo(null);
    pQR.moveTo(null);
    pL.moveTo(null);
    pR.moveTo(null);
    array.color(C.white);
    array.endAnimate();
    tree.startAnimate().color(C.white).endAnimate();
}
