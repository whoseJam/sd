import * as sd from "@/sd";
import { SegmentTree } from "../_/SegmentTree";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const n = 8;
const tree = new SegmentTree(svg, 1, n);
const array = new sd.Array(svg)
    .resize(n)
    .start(1)
    .cx(tree.cx())
    .y(tree.my() + 40);
const lPointer = sd.Pointer(array, "l", "t");
const rPointer = sd.Pointer(array, "r", "t");
const focus = sd.Focus(array);
const lc = x => x * 2;
const rc = x => x * 2 + 1;

sd.init(() => {});

sd.main(async () => {
    await query(2, 7, C.blue);
    await query(1, 8, C.blue);
});

async function query(ql, qr, color) {
    await sd.pause();
    lPointer.startAnimate().moveTo(ql).endAnimate();
    rPointer.startAnimate().moveTo(qr).endAnimate();
    async function colorOn(x, l, r) {
        await sd.pause();
        focus.startAnimate().focus(l, r).endAnimate();
        tree.startAnimate().color(x, color).endAnimate();
        if (ql <= l && r <= qr) {
            await sd.pause();
            tree.startAnimate().color(x, C.orange).endAnimate();
        }
        if (l === r) return;
        const mid = (l + r) >> 1;
        if (ql <= mid) await colorOn(lc(x), l, mid);
        if (qr > mid) await colorOn(rc(x), mid + 1, r);
        await sd.pause();
        focus.startAnimate().focus(l, r).endAnimate();
    }
    await colorOn(1, 1, n);
    await sd.pause();
    lPointer.startAnimate().moveTo(null).endAnimate();
    rPointer.startAnimate().moveTo(null).endAnimate();
    focus.startAnimate().focus(null).endAnimate();
    tree.startAnimate().color(C.white).endAnimate();
    return this;
}
