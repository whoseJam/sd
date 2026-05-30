import * as sd from "@/sd";
import { CDQ3D } from "../_/CDQ3D";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const GA = C.gradient(C.white, C.red, 0, 10);
const GB = C.gradient(C.white, C.textBlue, 0, 10);
const GC = C.gradient(C.white, C.orange, 0, 10);
const data = [
    { a: 2, b: 5, c: 1 },
    { a: 6, b: 4, c: 4 },
    { a: 1, b: 1, c: 8 },
    { a: 3, b: 7, c: 2 },
    { a: 5, b: 6, c: 7 },
    { a: 4, b: 3, c: 6 },
    { a: 7, b: 2, c: 9 },
    { a: 9, b: 8, c: 3 },
    { a: 8, b: 9, c: 5 },
];
const gap = 10;
const arr = new sd.ValueArray(svg).x(100).y(100).elementWidth(100);
const braces = sd.make1d(data.length, undefined);
const pI = sd.Pointer(arr, "i", "t");
const pJ = sd.Pointer(arr, "j", "t");
const sum = new sd.Array(svg).resize(data.length).start(1);
const focus = sd.Focus(sum);

let lineL;
let lineM;
let lineR;

sd.init(() => {
    data.forEach((value, i) => {
        const stk = new sd.Stack(svg).elementWidth(arr.elementWidth() - gap * 2);
        stk.valueA = value.a;
        stk.valueB = value.b;
        stk.valueC = value.c;
        stk.resize(3);
        stk.color(0, GA(value.a)).value(0, `a=${value.a}`);
        stk.color(1, GB(value.b)).value(1, `b=${value.b}`);
        stk.color(2, GC(value.c)).value(2, `c=${value.c}`);
        arr.push(stk);
    });
    sum.cx(arr.cx()).y(arr.my() + 240);
});

sd.main(async () => {
    await CDQ3D(arr, {
        onCheckALessThanB,
        onMoveI,
        onMoveJ,
        onStartMerge,
        onEndMerge,
        onSortDim1,
        onSortDim2,
        onInsert,
        onQuery,
    });
});

async function onInsert(j) {
    await sd.pause();
    const value = arr.element(j).valueC;
    arr.element(j).link = sd.Link(arr.element(j), sum.element(value), sd.Line, "cx", "my", "cx", "y").startAnimate().pointStoT().endAnimate().arrow();
}

async function onQuery(i) {
    await sd.pause();
    const value = arr.element(i).valueC;
    focus.startAnimate().focus(1, value).endAnimate();
    await sd.pause();
    focus.startAnimate().focus(null).endAnimate();
}

async function onSortDim1() {
    await sd.pause();
    arr.startAnimate()
        .sort((a, b) => a.valueA - b.valueA)
        .endAnimate();
    await sd.pause();
    arr.forEachElement((element, i) => {
        braces[i] = new sd.BraceCurve(svg);
        moveBrace(braces[i], i, i);
        braces[i].opacity(0).startAnimate().opacity(1).endAnimate();
    });
}

async function onSortDim2(l, r) {
    await sd.pause();
    arr.startAnimate()
        .sort(l, r, (a, b) => a.valueB - b.valueB)
        .endAnimate();
}

function onCheckALessThanB(a, b) {
    return a.valueB <= b.valueB;
}

async function onMoveI(i) {
    await sd.pause();
    pI.startAnimate().moveTo(i).endAnimate();
}

async function onMoveJ(j) {
    await sd.pause();
    pJ.startAnimate().moveTo(j).endAnimate();
}

async function onStartMerge(l, r) {
    const m = (l + r) >> 1;
    await sd.pause();
    arr.startAnimate();
    for (let i = l; i <= r; i++) arr.element(i).dy(80);
    arr.endAnimate();
    braces[l].startAnimate().dy(80).endAnimate();
    braces[m + 1].startAnimate().dy(80).endAnimate();
    await sd.pause();
    braces[l].startAnimate().value("L", R.pointAtPathByRate(0.5, "cx", "my", 0, -3)).endAnimate();
    braces[m + 1].startAnimate().value("R", R.pointAtPathByRate(0.5, "cx", "my", 0, -3)).endAnimate();
    lineL = makeLine(l, "l").startAnimate().pointStoT().endAnimate();
    lineM = makeLine(m, "r").startAnimate().pointStoT().endAnimate();
    lineR = makeLine(r, "r").startAnimate().pointStoT().endAnimate();
}

async function onEndMerge(l, r) {
    const m = (l + r) >> 1;
    await sd.pause();
    pI.startAnimate().moveTo(null).endAnimate();
    pJ.startAnimate().moveTo(null).endAnimate();
    await sd.pause();
    lineL.startAnimate().fadeStoT().endAnimate().remove();
    lineM.startAnimate().fadeStoT().endAnimate().remove();
    lineR.startAnimate().fadeStoT().endAnimate().remove();
    braces[l].startAnimate().value(null).endAnimate();
    braces[m + 1].startAnimate().value(null).endAnimate();
    for (let i = l; i <= m; i++)
        if (arr.element(i).link) {
            arr.element(i).link.startAnimate().fadeStoT().endAnimate().remove();
            arr.element(i).link = undefined;
        }
    await sd.pause();
    braces[l].startAnimate();
    moveBrace(braces[l], l, r);
    braces[l].endAnimate();
    braces[m + 1].startAnimate().fadeStoT().endAnimate().remove();
    await sd.pause();
    arr.startAnimate();
    for (let i = l; i <= r; i++) arr.element(i).dy(-80);
    arr.endAnimate();
    braces[l].startAnimate().dy(-80).endAnimate();
}

function makeLine(at, location) {
    const line = new sd.Line(svg);
    if (location === "l") {
        line.source(arr.element(at).pos("x", "y", -gap, -10));
        line.target(arr.element(at).pos("x", "my", -gap, +10));
    } else {
        line.source(arr.element(at).pos("mx", "y", gap, -10));
        line.target(arr.element(at).pos("mx", "my", gap, +10));
    }
    return line;
}

function moveBrace(brace, l, r) {
    brace.source(arr.element(l).pos("x", "y", 0, -3));
    brace.target(arr.element(r).pos("mx", "y", 0, -3));
}
