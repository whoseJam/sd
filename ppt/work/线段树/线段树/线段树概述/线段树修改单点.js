import * as sd from "@/sd";
import { pointSelect, SegmentTree } from "../_/SegmentTree";

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
const target = sd.Pointer(array, "target", "t");
const lPointer = sd.Pointer(array, "l", "t");
const rPointer = sd.Pointer(array, "r", "t");
const focus = sd.Focus(array);

sd.init(() => {});

sd.main(async () => {
    await query(2, C.green);
    await query(7, C.green);
    await query(3, C.green);
});

async function query(pos) {
    await sd.pause();
    target.startAnimate().moveTo(pos).endAnimate();
    await pointSelect(tree, pos, {
        async onEnter(x, l, r) {
            await sd.pause();
            focus.startAnimate().focus(l, r).endAnimate();
            tree.startAnimate().color(x, C.green).endAnimate();
        },
    });
    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
    target.startAnimate().moveTo(null).endAnimate();
    tree.startAnimate().color(C.white).endAnimate();
}
