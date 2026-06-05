import * as sd from "@/sd";
import { Manacher } from "../_/Manacher";

const svg = sd.svg();
// const data = "abbabbabaaaba";
const data = "aaaaabaa";
const str = new sd.Array(svg);
const pos = sd.Pointer(str, "pos", "b", 15, 20);
const idx = sd.Pointer(str, "i", "b", 15, 20);
const mirror = sd.Brace(str);
const mirrorCenter = sd.Brace(str);
const current = sd.Brace(str);

let currentI = 0;

sd.init(() => {
    str.pushArray(data);
    str.cx(600).cy(300);
});

sd.main(async () => {
    await Manacher(str, {
        onIMove,
        onCheckMirrorSymmetry,
        onILengthInitialized: onILengthUpdated,
        onILengthExtended: onILengthUpdated,
        onMirrorSymmetryCenterUpdated,
        onILengthCalcFinished: async () => {
            await sd.pause();
            mirror.startAnimate().opacity(0).endAnimate();
            current.startAnimate().opacity(0).endAnimate();
        },
    });
});

async function onIMove(i) {
    await sd.pause();
    currentI = i;
    str.startAnimate();
    idx.moveTo(i).length(20);
    str.endAnimate();
}

async function onCheckMirrorSymmetry(center, length) {
    await sd.pause();
    mirror
        .startAnimate()
        .brace(center - length + 1, center + length - 1, "b", 5)
        .endAnimate();
    current.after(mirror).brace(center - length + 1, center + length - 1, "b", 5);
}

async function onILengthUpdated(i, length) {
    await sd.pause();
    current
        .startAnimate()
        .brace(i - length + 1, i + length - 1, "b", 15)
        .endAnimate();
}

async function onMirrorSymmetryCenterUpdated(center, length) {
    await sd.pause();
    str.startAnimate();
    pos.moveTo(center);
    if (center === currentI) idx.length(40);
    mirrorCenter.brace(center - length + 1, center + length - 1);
    str.endAnimate();
}
