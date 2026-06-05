import * as sd from "@/sd";
import { CDQ2D } from "../_/CDQ2D";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const GX = C.gradient(C.white, C.red, 0, 10);
const GY = C.gradient(C.white, C.textBlue, 0, 10);
const data = [
    { x: 4, y: 2 },
    { x: 6, y: 1 },
    { x: 5, y: 3 },
    { x: 8, y: 4 },
    { x: 3, y: 6 },
    { x: 1, y: 5 },
    { x: 2, y: 9 },
    { x: 7, y: 7 },
    { x: 9, y: 8 },
];
const gap = 10;
const arr = new sd.ValueArray(svg).x(100).y(100).elementWidth(100);
const braces = sd.make1d(data.length, undefined);
const pI = sd.Pointer(arr, "i", "t");
const pJ = sd.Pointer(arr, "j", "t");

sd.init(() => {
    data.forEach((value, i) => {
        const stk = new sd.Stack(arr).elementWidth(arr.elementWidth() - gap * 2);
        stk.valueX = value.x;
        stk.valueY = value.y;
        stk.resize(2);
        stk.color(0, GX(value.x)).value(0, `x=${value.x}`);
        stk.color(1, GY(value.y)).value(1, `y=${value.y}`);
        arr.push(stk);
    });
});

sd.main(async () => {
    await CDQ2D(arr, {
        onCheckALessThanB,
        onMoveI,
        onMoveJ,
        onStartMerge,
        onEndMerge,
        onSortDim1,
        onSortDim2,
    });
});

async function onSortDim1() {
    await sd.pause();
    arr.startAnimate()
        .sort((a, b) => a.valueX - b.valueX)
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
        .sort(l, r, (a, b) => a.valueY - b.valueY)
        .endAnimate();
}

function onCheckALessThanB(a, b) {
    return a.valueX < b.valueX && a.valueY < b.valueY;
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
    global.lineL = makeLine(l, "l").startAnimate().pointStoT().endAnimate();
    global.lineM = makeLine(m, "r").startAnimate().pointStoT().endAnimate();
    global.lineR = makeLine(r, "r").startAnimate().pointStoT().endAnimate();
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
