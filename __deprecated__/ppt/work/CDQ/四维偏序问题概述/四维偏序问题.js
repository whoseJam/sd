import * as sd from "@/sd";
import { CDQ4D } from "../_/CDQ4D";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const GA = C.gradient(C.white, C.red, 0, 10);
const GB = C.gradient(C.white, C.textBlue, 0, 10);
const GC = C.gradient(C.white, C.orange, 0, 10);
const GD = C.gradient(C.white, C.darkPink, 0, 10);
const data = [
    { a: 1, b: 3, c: 2, d: 5 },
    { a: 6, b: 4, c: 7, d: 4 },
    { a: 2, b: 1, c: 1, d: 2 },
    { a: 3, b: 7, c: 8, d: 7 },
    { a: 5, b: 6, c: 4, d: 6 },
    { a: 4, b: 5, c: 3, d: 9 },
    { a: 7, b: 2, c: 9, d: 1 },
    { a: 9, b: 8, c: 6, d: 8 },
    { a: 8, b: 9, c: 5, d: 3 },
];
const gap = 10;
const arr = new sd.ValueArray(svg).x(100).y(100).elementWidth(100);
const braces1 = sd.make1d(data.length, undefined);
const braces2 = sd.make1d(data.length, undefined);
const pI = sd.Pointer(arr, "i", "b");
const pJ = sd.Pointer(arr, "j", "b");
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
        stk.valueD = value.d;
        stk.resize(4);
        stk.color(0, GA(value.a)).value(0, `a=${value.a}`);
        stk.color(1, GB(value.b)).value(1, `b=${value.b}`);
        stk.color(2, GC(value.c)).value(2, `c=${value.c}`);
        stk.color(3, GD(value.d)).value(3, `d=${value.d}`);
        arr.push(stk);
    });
    sum.cx(arr.cx()).y(arr.my() + 240);
});

sd.main(async () => {
    await CDQ4D(arr, {
        onCheckALessThanB,
        onMoveI,
        onMoveJ,
        onStartMerge1,
        onEndMerge1,
        onStartMerge2,
        onEndMerge2,
        onSortDim1,
        onSortDim2,
        onSortDim3,
        onInsert,
        onQuery,
    });
});

async function onInsert(j) {
    await sd.pause();
    const value = arr.element(j).valueD;
    arr.element(j).link = sd.Link(arr.element(j), sum.element(value), sd.Line, "cx", "my", "cx", "y").startAnimate().pointStoT().endAnimate().arrow();
}

async function onQuery(i) {
    await sd.pause();
    const value = arr.element(i).valueD;
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
        braces1[i] = new sd.BraceCurve(svg);
        moveBrace1(braces1[i], i, i);
        braces1[i].opacity(0).startAnimate().opacity(1).endAnimate();
    });
}

async function onSortDim2(l, r) {
    await sd.pause();
    arr.startAnimate()
        .sort(l, r, (a, b) => a.valueB - b.valueB)
        .endAnimate();
}

async function onSortDim3(l, r) {
    await sd.pause();
    arr.startAnimate()
        .sort(l, r, (a, b) => a.valueC - b.valueC)
        .endAnimate();
}

function onCheckALessThanB(a, b) {
    return a.valueC <= b.valueC;
}

async function onMoveI(i) {
    await sd.pause();
    pI.startAnimate().moveTo(i).endAnimate();
}

async function onMoveJ(j) {
    await sd.pause();
    pJ.startAnimate().moveTo(j).endAnimate();
}

async function onStartMerge1(l, r) {
    const m = (l + r) >> 1;
    await sd.pause();
    for (let i = l; i <= r; i++) {
        if (!braces2[i]) braces2[i] = new sd.BraceCurve(svg);
        moveBrace2(braces2[i], i, i);
        braces2[i].opacity(0).startAnimate().opacity(1).endAnimate();
    }
    arr.startAnimate();
    for (let i = l; i <= m; i++) {
        const stk = arr.element(i);
        stk.forEachElement(element => element.stroke(C.textBlue).strokeWidth(4));
    }
    for (let i = m + 1; i <= r; i++) {
        const stk = arr.element(i);
        stk.forEachElement(element => element.stroke(C.red).strokeWidth(4));
    }
    arr.endAnimate();
}

async function onEndMerge1(l, r) {
    const m = (l + r) >> 1;
    await sd.pause();
    arr.startAnimate();
    for (let i = l; i <= r; i++) {
        const stk = arr.element(i);
        stk.forEachElement(element => element.stroke(C.black).strokeWidth(1));
        if (braces2[i]) braces2[i].startAnimate().opacity(0).endAnimate();
    }
    arr.endAnimate();
    braces1[l].startAnimate();
    moveBrace1(braces1[l], l, r);
    braces1[l].endAnimate();
    braces1[m + 1].startAnimate().fadeStoT().endAnimate().remove();
    braces1[m + 1] = undefined;
}

async function onStartMerge2(l, r) {
    const m = (l + r) >> 1;
    await sd.pause();
    arr.startAnimate();
    for (let i = l; i <= r; i++) arr.element(i).dy(80);
    arr.endAnimate();
    braces2[l].startAnimate().dy(80).endAnimate();
    braces2[m + 1].startAnimate().dy(80).endAnimate();
    await sd.pause();
    braces2[l].startAnimate().value("L", R.pointAtPathByRate(0.5, "cx", "y", 0, 3)).endAnimate();
    braces2[m + 1].startAnimate().value("R", R.pointAtPathByRate(0.5, "cx", "y", 0, 3)).endAnimate();
    lineL = makeLine(l, "l").startAnimate().pointStoT().endAnimate();
    lineM = makeLine(m, "r").startAnimate().pointStoT().endAnimate();
    lineR = makeLine(r, "r").startAnimate().pointStoT().endAnimate();
}

async function onEndMerge2(l, r) {
    const m = (l + r) >> 1;
    await sd.pause();
    pI.startAnimate().moveTo(null).endAnimate();
    pJ.startAnimate().moveTo(null).endAnimate();
    await sd.pause();
    lineL.startAnimate().fadeStoT().endAnimate().remove();
    lineM.startAnimate().fadeStoT().endAnimate().remove();
    lineR.startAnimate().fadeStoT().endAnimate().remove();
    braces2[l].startAnimate().value(null).endAnimate();
    braces2[m + 1].startAnimate().value(null).endAnimate();
    for (let i = l; i <= m; i++)
        if (arr.element(i).link) {
            arr.element(i).link.startAnimate().fadeStoT().endAnimate().remove();
            arr.element(i).link = undefined;
        }
    await sd.pause();
    braces2[l].startAnimate();
    moveBrace2(braces2[l], l, r);
    braces2[l].endAnimate();
    braces2[m + 1].startAnimate().fadeTtoS().endAnimate().remove();
    braces2[m + 1] = undefined;
    await sd.pause();
    arr.startAnimate();
    for (let i = l; i <= r; i++) arr.element(i).dy(-80);
    arr.endAnimate();
    braces2[l].startAnimate().dy(-80).endAnimate();
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

function moveBrace1(brace, l, r) {
    brace.source(arr.element(l).pos("x", "y", 0, -3));
    brace.target(arr.element(r).pos("mx", "y", 0, -3));
}

function moveBrace2(brace, l, r) {
    brace.source(arr.element(r).pos("mx", "my", 0, 3));
    brace.target(arr.element(l).pos("x", "my", 0, 3));
}
