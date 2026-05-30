import * as sd from "@/sd";
import { rangeSelect, SegmentTree } from "../_/SegmentTree";

const svg = sd.svg();
const R = sd.rule();
const EX = sd.exit();
const C = sd.color();
const n = 8;
const tree = new SegmentTree(svg, 1, n).width(1000);
const array = new sd.Array(svg)
    .resize(n)
    .start(1)
    .cx(tree.cx())
    .y(tree.my() + 80);
const target = sd.Pointer(array, "target", "t");
const brace = sd.Brace(array);
const lPointer = sd.Pointer(array, "l", "t");
const rPointer = sd.Pointer(array, "r", "t");
const focus = sd.Focus(array);
const lc = x => x * 2;
const rc = x => x * 2 + 1;

sd.init(() => {
    tree.forEachNode(node => {
        node.childAs("impact", new sd.ValueStack(node).elementWidth(15).elementHeight(15));
    });
});

sd.main(async () => {
    await impact(1, 6, +3);
    await query(1, 4);
    await query(1, 6);
    await impact(1, 2, +4);
    await query(1, 7);
    await query(1, 3);
});

function pushAdd(x, d) {
    const node = tree.element(x);
    const add = node.child("add");
    if (add)
        add.startAnimate()
            .text(convert(+add.text() + d))
            .endAnimate();
    else
        node.startAnimate()
            .childAs("add", new sd.Text(node, convert(d)), R.aside("rc"))
            .endAnimate();
}

async function onPushDown(x) {
    const node = tree.element(x);
    const add = node.child("add");
    if (!add || add.text() === " ") return;
    await sd.pause();
    add.startAnimate().opacity(0.5);
    pushAdd(lc(x), +add.text());
    pushAdd(rc(x), +add.text());
    const ladd = tree.element(lc(x)).child("add");
    const radd = tree.element(rc(x)).child("add");
    const lline = new sd.Line(svg).source(add.cx(), add.my()).target(ladd.cx(), ladd.y()).startAnimate().pointStoT().endAnimate().arrow();
    const rline = new sd.Line(svg).source(add.cx(), add.my()).target(radd.cx(), radd.y()).startAnimate().pointStoT().endAnimate().arrow();
    await sd.pause();
    node.startAnimate().eraseChild(add).endAnimate();
    lline.startAnimate().fadeStoT().endAnimate().remove();
    rline.startAnimate().fadeStoT().endAnimate().remove();
}

async function impact(ql, qr, d) {
    await sd.pause();
    brace.startAnimate().brace(ql, qr).value(convert(d)).endAnimate();
    lPointer.startAnimate().moveTo(ql).endAnimate();
    rPointer.startAnimate().moveTo(qr).endAnimate();
    await rangeSelect(tree, ql, qr, {
        async onEnter(x, l, r) {
            await sd.pause();
            tree.startAnimate().color(x, C.green).endAnimate();
            focus.startAnimate().focus(l, r).endAnimate();
        },
        async onSelect(x, l, r) {
            await sd.pause();
            pushAdd(x, d);
        },
        onPushDown,
        async onExit(x, l, r) {
            await sd.pause();
            focus.startAnimate().focus(l, r).endAnimate();
        },
    });
    await sd.pause();
    brace.startAnimate().opacity(0).endAnimate();
    lPointer.startAnimate().moveTo(null).endAnimate();
    rPointer.startAnimate().moveTo(null).endAnimate();
    focus.startAnimate().focus(null).endAnimate();
    tree.startAnimate().color(C.white).endAnimate();
}

async function query(ql, qr) {
    await sd.pause();
    lPointer.startAnimate().moveTo(ql).endAnimate();
    rPointer.startAnimate().moveTo(qr).endAnimate();
    await rangeSelect(tree, ql, qr, {
        async onEnter(x, l, r) {
            await sd.pause();
            tree.startAnimate().color(x, C.blue).endAnimate();
            focus.startAnimate().focus(l, r).endAnimate();
        },
        async onSelect(x, l, r) {
            await sd.pause();
            tree.startAnimate().color(x, C.orange).endAnimate();
            array.startAnimate().color(l, r, C.orange).endAnimate();
        },
        onPushDown,
        async onExit(x, l, r) {
            await sd.pause();
            focus.startAnimate().focus(l, r).endAnimate();
        },
    });
    await sd.pause();
    lPointer.startAnimate().moveTo(null).endAnimate();
    rPointer.startAnimate().moveTo(null).endAnimate();
    focus.startAnimate().focus(null).endAnimate();
    tree.startAnimate().color(C.white).endAnimate();
    array.startAnimate().color(C.white).endAnimate();
}

function convert(v) {
    if (v > 0) return "+" + v;
    if (v < 0) return v;
    return " ";
}
