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
    for (let i = 1; i < n; i++) {
        const l = sd.Link(arr.element(i), arr.element(i + 1), sd.Curve, "cx", "y", "cx", "y").bending(-1);
        l.opacity(0.3).arrow();
        links.push(l);
    }
    for (let i = 1; i <= m; i++) {
        arr.value(assign[i][1], assign[i][2]);
    }
    sd.Label(arr, "x");
    sd.Index(arr, "b");
});

sd.main(async () => {
    await sd.pause();
    links.forEach(l => l.startAnimate().opacity(1).endAnimate());
});
