import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = "1246";
const arr = new sd.Array(svg).pushArray(data);
const segments = [
    [0, 1],
    [2, 3]
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
})