import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = "124612412318";
const arr = new sd.Array(svg).pushArray(data);
const segments = [
    [0, 1],
    [2, 3],
    [4, 8],
    [9, 11]
];

sd.init(() => {
    sd.Label(arr, "m=2", "lc", 20, 30);
})

sd.main(async () => {
    await sd.pause();
    segments.forEach((segment, idx) => {
        const brace = sd.Brace(arr).brace(segment[0], segment[1]);
        brace.startAnimate().pointStoT().endAnimate();
        if (idx !== 0) {
            const line = new sd.Line(svg).source(0, 0).target(0, 80).stroke(C.red).strokeWidth(2);
            line.cx(arr.element(segment[0]).x()).my(arr.my() + 10);
            line.startAnimate().pointStoT().endAnimate();
        }
    });
    await sd.pause();
    segments.forEach((segment, idx) => {
        if (idx > 0) {
            const link = sd.Link(arr.element(segments[idx - 1][1]), arr.element(segment[1]), sd.Curve, "cx", "my", "cx", "my");
            link.opacity(0).after(arr).opacity(1).startAnimate().pointStoT().endAnimate().arrow();
        }
        arr.startAnimate().color(segment[1], C.green).endAnimate();
    });
})