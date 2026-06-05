import * as sd from "@/sd";
import { KMP } from "../_/KMP";

const svg = sd.svg();
const C = sd.color();
const sString = "ABABACBABC";
const tString = "ABABC";
const s = new sd.Array(svg).pushArray(sString).start(1);
const t = new sd.Array(svg).pushArray(tString).start(1);
const ps = sd.Pointer(s, "", "b", 3, 20, 3);
const pt = sd.Pointer(t, "", "b", 3, 20, 3);

let moveArrayT = false;
let currentIndexI = s.start();

sd.init(() => {
    t.y(80);
    sd.Label(s, "s");
    sd.Label(t, "t");
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
