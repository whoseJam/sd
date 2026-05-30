import * as sd from "@/sd";

const svg = sd.svg();
const I = sd.input();
const n = 5;
const m = 5;
const arr = new sd.Array(svg).resize(n).start(1);
const assign = I.readIntMatrix(
    `
1 3
2 2
3 3
4 1
5 2`,
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

sd.main(async () => {});
