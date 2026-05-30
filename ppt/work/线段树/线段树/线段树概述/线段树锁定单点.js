import * as sd from "@/sd";
import { pointSelect, rangeSelect, SegmentTree } from "../_/SegmentTree";

const svg = sd.svg();
const div = sd.div();
const R = sd.rule();
const C = sd.color();
const n = 8;
const tree = new SegmentTree(svg, 1, n).cx(600).cy(200);
const array = new sd.Array(svg)
    .resize(n)
    .start(1)
    .cx(tree.cx())
    .y(tree.my() + 40);
const target = sd.Pointer(array, "target", "t");
const pL = sd.Pointer(array, "l", "t");
const pR = sd.Pointer(array, "r", "t");

const inputs = new sd.ValueStack(div);
const l = new sd.Slider(div).min(1).max(n).value(1);
const r = new sd.Slider(div).min(1).max(n).value(1);
sd.Label(l, "l");
sd.Label(r, "r");
const button = new sd.Button(div).text("Query").onClick(() => {
    sd.inter(async () => {
        const ql = Math.min(l.value(), r.value());
        const qr = Math.max(l.value(), r.value());
        pL.startAnimate().moveTo(ql).endAnimate();
        pR.startAnimate().moveTo(qr).endAnimate();
        await rangeSelect(tree, l.value(), r.value(), {
            async onSelect(x, l, r) {
                await sd.pause();
                array.startAnimate().color(l, r, C.orange).endAnimate();
                tree.startAnimate().color(x, C.orange).endAnimate();
            },
        });
        await sd.pause();
        pL.startAnimate().moveTo(null).endAnimate();
        pR.startAnimate().moveTo(null).endAnimate();
        tree.startAnimate().color(C.white).endAnimate();
        array.startAnimate().color(C.white).endAnimate();
    });
});
inputs.push(l).push(r).push(button);
inputs.mx(tree.x() - 60).cy(tree.cy());

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        array.element(i).onClick(() => {
            sd.inter(async () => {
                target.startAnimate().moveTo(i).endAnimate();
                await pointSelect(tree, i, {
                    async onEnter(x) {
                        await sd.pause();
                        tree.startAnimate().color(x, C.green).endAnimate();
                    },
                });
                await sd.pause();
                target.startAnimate().moveTo(null).endAnimate();
                tree.startAnimate().color(C.white).endAnimate();
            });
        });
    }
});

sd.main(async () => {});
