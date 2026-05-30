import * as sd from "@/sd";

const svg = sd.svg();
const I = sd.input();
const n = 5;
const m = 2;
const arr = new sd.Array(svg).resize(n).start(1);
const assign = I.readIntMatrix(
    `
1 1
4 3`,
    m,
    2
);
const links = [];

sd.init(() => {
    sd.Label(arr, "x");
    sd.Index(arr, "b");
});

sd.main(async () => {
    await sd.pause();
    for (let i = 1; i < n; i++) {
        const l = sd.Link(arr.element(i), arr.element(i + 1), sd.Curve, "cx", "y", "cx", "y").bending(-1);
        l.startAnimate().pointStoT().endAnimate().arrow();
        links.push(l);
    }
    await sd.pause();
    arr.startAnimate();
    for (let i = 1; i <= m; i++) {
        arr.value(assign[i][1], assign[i][2]);
    }
    arr.endAnimate();
    await sd.pause();
    links.forEach(l => l.startAnimate().opacity(0.3).endAnimate());
});
