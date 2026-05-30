import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const posI = 7;
const seq = [2, 4, 7, 9];
const arr = new sd.Array(svg).resize(n).start(1);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    seq.forEach(pos => {
        arr.startAnimate().color(pos, C.blue).endAnimate();
    });
    await sd.pause();
    const pI = sd.Pointer(arr, "f(i)", "b", 3, 20, 3);
    const pJ = sd.Pointer(arr, "f(j)", "b", 3, 20, 3);
    pI.value().fontSize(15);
    pJ.value().fontSize(15);
    arr.startAnimate();
    pI.moveTo(posI);
    for (let i = 1; i <= n; i++) {
        if (i !== posI) arr.color(i, C.white);
        else arr.color(i, C.blue);
    }
    arr.endAnimate();

    let lastLink;
    for (let j = 1; j < posI; j++) {
        await sd.pause();
        if (lastLink) lastLink.startAnimate().fadeStoT().endAnimate().remove();
        arr.startAnimate();
        if (j > 1) arr.color(j - 1, C.white);
        arr.color(j, C.blue);
        pJ.moveTo(j);
        arr.endAnimate();
        lastLink = sd.Link(arr.element(j), arr.element(posI), sd.Curve, "cx", "my", "cx", "my").startAnimate().pointStoT().endAnimate().arrow();
    }
});
