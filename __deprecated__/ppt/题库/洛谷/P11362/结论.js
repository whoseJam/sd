import * as sd from "@/sd";

const svg = sd.svg();
const I = sd.input();
const n = 10;
const m = 3;
const arr = new sd.Array(svg).resize(n).start(1);
const assign = I.readIntMatrix(`
3 1
5 3
8 2`, m, 2);
const links = [];

sd.init(() => {
    for (let i = 1; i < n; i++) {
        const l = sd.Link(arr.element(i), arr.element(i + 1), sd.Curve, "cx", "y", "cx", "y").bending(-1)..arrow();
        links.push(l);
    }
    for (let i = 1; i <= m; i++) {
        arr.value(assign[i][1], assign[i][2]);
    }
    sd.Label(arr, "x");
    sd.Index(arr, "b");
})

sd.main(async () => {
    
})