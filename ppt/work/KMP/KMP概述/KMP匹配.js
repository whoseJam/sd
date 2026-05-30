import * as sd from "@/sd";
import { buildLenSync } from "../_/BuildLenSync";
import { KMP } from "../_/KMP";

const svg = sd.svg();
const C = sd.color();
const sString = "ABABACBABC";
const tString = "ABABC";
const s = new sd.Array(svg).pushArray(sString).start(1);
const t = new sd.Array(svg).pushArray(tString).start(1);
const len = new sd.Array(svg).start(1);
const ps = sd.Pointer(s, "", "b", 3, 20, 3);
const pt = sd.Pointer(t, "", "b", 3, 20, 3);
const ls = new sd.Line(svg).opacity(0);
const lt = new sd.Line(svg).opacity(0);

let moveArrayT = false;
let currentIndexI = s.start();

sd.init(() => {
    t.y(80);
    sd.Label(s, "s");
    sd.Label(t, "t");
    const l = buildLenSync(" " + tString);
    for (let i = 1; i <= t.length(); i++) len.push(l[i]);
    t.childAs(len, function (parent, child) {
        child.x(parent.x()).y(parent.my());
    });
});

sd.main(async () => {
    await KMP(s, t, {
        onPointerIMove,
        onPointerJMove,
        onMatch,
        onFail,
        onJumpFail,
    });
});

async function onPointerIMove(i) {
    currentIndexI = i;
    ps.startAnimate().moveTo(i).endAnimate();
    if (moveArrayT) {
        s.startAnimate()
            .color(i - 1, C.white)
            .endAnimate();
        t.startAnimate().dx(40).color(1, C.white).endAnimate();
        moveArrayT = false;
    }
}

async function onPointerJMove(j) {
    if (currentIndexI === s.end()) return;
    await sd.pause();
    if (j + 1 <= t.length())
        pt.startAnimate()
            .moveTo(j + 1)
            .endAnimate();
    else pt.startAnimate().dx(40).endAnimate();
}

async function onMatch(i, j) {
    await sd.pause();
    s.startAnimate().color(i, C.green).endAnimate();
    t.startAnimate().color(j, C.green).endAnimate();
}

async function onFail(i, j) {
    await sd.pause();
    if (1 <= j && j <= t.length()) {
        s.startAnimate().color(i, C.red).endAnimate();
        t.startAnimate().color(j, C.red).endAnimate();
    } else if (j === 0) {
        moveArrayT = true;
    } else {
        s.startAnimate().color(i, C.red).endAnimate();
    }
}

async function onJumpFail(i, j, len) {
    if (len) {
        await sd.pause();
        updateLine(ls, s, i - len, i - 1);
        updateLine(lt, t, 1, len);
        await sd.pause();
        ls.startAnimate().opacity(0).arrow(null).endAnimate();
        lt.startAnimate().opacity(0).arrow(null).endAnimate();
    }
    await sd.pause();
    const color = s.text(i) === t.text(len + 1) ? C.green : C.red;
    t.startAnimate()
        .dx((j - len) * 40)
        .color(len + 1, Math.min(j + 1, t.length()), C.white)
        .endAnimate();
    s.startAnimate()
        .color(i, C.white)
        .color(i - j, i - len - 1, C.white)
        .endAnimate();
    pt.after(0)
        .startAnimate()
        .moveTo(len + 1)
        .endAnimate();

    await sd.pause();
    s.startAnimate().color(i, color).endAnimate();
    t.startAnimate()
        .color(len + 1, color)
        .endAnimate();
}

function updateLine(line, str, l, r) {
    line.opacity(1);
    line.source(str.element(l).x(), str.y() - 5);
    line.target(str.element(r).mx(), str.y() - 5);
    line.startAnimate().pointStoT().endAnimate().arrow();
}
