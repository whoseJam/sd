import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const seq = [1, 3, 4 ,7, 10];
const arr = new sd.Array(svg).resize(n).start(1);

sd.init(() => {
    arr.resize(n);
})

sd.main(async () => {
    await sd.pause();
    for (let i = 0; i < seq.length; i++) {
        arr.startAnimate().color(seq[i], C.blue).endAnimate();
        if (i + 1 < seq.length) {
            const link = sd.Link(arr.element(seq[i]), arr.element(seq[i+1]), sd.Curve, "cx", "my", "cx", "my");
            link.opacity(0).after(arr).opacity(1).startAnimate().pointStoT().endAnimate().arrow();
        }
    }
})