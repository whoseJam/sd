import * as sd from "@/sd";

import { buildFailTreeFromLen } from "../_/buildFailTreeFromLen";
import { buildLenSync } from "../_/BuildLenSync";
import { KMP } from "../_/KMP";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const str = " abbabaabbabb";
const n = str.length - 1;
const arr = new sd.Array(svg);
const s = new sd.Array(svg).pushArray("abbabbaabbabaabbabb").opacity(0).start(1);
const gap = 5;
const locations = [
    // locations
    {},
    { location: "tc", gap: gap },
    { location: "tc", gap: gap },
    { location: "tc", gap: gap },
    { location: "tc", gap: gap },
    { location: "tc", gap: gap },
    { location: "rc", gap: gap },
    { location: "rc", gap: gap },
    { location: "rc", gap: gap },
    { location: "tc", gap: gap },
    { location: "tc", gap: gap },
    { location: "tc", gap: gap },
    { location: "rc", gap: gap },
];
const len = buildLenSync(str);
const ps = sd.Pointer(s, "", "b", 3, 20, 3);
let focus;

sd.init(() => {
    for (let i = 0; i <= n; i++) arr.push(str[i]);
    for (let i = 0; i <= n; i++) arr.element(i).childAs(new sd.Text(svg, i).fontSize(12), R.aside("bc", 3));
    arr.x(100).cy(200);
});

sd.main(async () => {
    await buildFailTreeFromLen(arr, len, locations, {
        onCreateTree,
    });
    s.cx(global.tree.cx()).y(global.tree.my()).startAnimate().opacity(1).endAnimate();
    await KMP(s, arr, {
        onPointerIMove,
        onPointerJMove,
        onMatch,
        onFail,
        onJumpFail,
    });
});

async function onPointerIMove(i) {
    await sd.pause();
    ps.startAnimate().moveTo(i).endAnimate();
}

async function onPointerJMove(j) {
    if (j + 1 <= n) {
        focus.startAnimate().focus(arr.element(j)).endAnimate();
    }
}

async function onMatch(i, j) {
    await sd.pause();
    s.startAnimate().color(i, C.green).endAnimate();
    arr.startAnimate().color(j, C.green).endAnimate();
}

async function onFail(i, j) {
    await sd.pause();
    if (1 <= j && j <= arr.length()) {
        s.startAnimate().color(i, C.red).endAnimate();
        arr.startAnimate().color(j, C.red).endAnimate();
    } else if (j === 0) {
    }
}

async function onJumpFail(i, j, len) {
    await sd.pause();
    focus.startAnimate().focus(len).endAnimate();
    arr.startAnimate()
        .color(len + 2, j + 1, C.white)
        .color(len + 1, C.red)
        .endAnimate();
    s.startAnimate()
        .color(i - j, i - len - 1, C.white)
        .endAnimate();
}

function onCreateTree(tree) {
    global.tree = tree;
    focus = sd.Focus(tree);
    tree.layerWidth(150).height(600).x(arr.x()).cy(arr.cy());
}
