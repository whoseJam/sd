import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const arr = new sd.Array(svg).start(1);
const n = 10;
const i = 3;
const j = 8;

sd.init(() => {
    arr.resize(n);
    sd.Pointer(arr, "i", "t", 5, 30, 5).moveTo(i);
    sd.Pointer(arr, "j", "t", 5, 30, 5).moveTo(j);
    arr.color(i, C.red);
    arr.color(j, C.red);
    for (let i = 1; i < n; i++) {
        const l = sd.Link(arr.element(i), arr.element(i + 1), sd.Curve, "cx", "y", "cx", "y").bending(-1);
        l.opacity(0.3).arrow();
    }
});

sd.main(async () => {});
