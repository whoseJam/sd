import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const arr = new sd.Array(svg).resize(n).start(1);
const pI = sd.Pointer(arr, "i", "t", 5, 30, 5);
const pJ = sd.Pointer(arr, "j", "t", 5, 30, 5);

sd.init(() => {
    arr.x(100).y(100);
});

sd.main(async () => {
    for (let i = 2; i <= n; i++) {
        await sd.pause();
        pI.startAnimate().moveTo(i).endAnimate();
        for (let j = 1; j < i; j++) {
            await sd.pause();
            pJ.startAnimate().moveTo(j).endAnimate();
            const link = sd.Link(arr.element(j), arr.element(i), sd.Curve, "cx", "y", "cx", "y").bending(-0.5).startAnimate().pointStoT().endAnimate().arrow();
            await sd.pause();
            link.startAnimate().fadeStoT().endAnimate().arrow(null).remove();
        }
        await sd.pause();
        pJ.startAnimate().moveTo(null).endAnimate();
    }
});
