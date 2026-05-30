import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const arr = new sd.Array(svg).resize(n).start(1);
const segments = [
    [1, 3],
    [2, 6],
    [9, 10],
];

sd.init(() => {
    arr.color(C.green);
});

sd.main(async () => {
    const brace = sd.Brace(arr);
    for (const segment of segments) {
        const [l, r] = segment;
        await sd.pause();
        brace.startAnimate().brace(l, r).endAnimate();
        arr.startAnimate().color(l, r, C.white).endAnimate();
        await sd.pause();
        brace.startAnimate().opacity(0).endAnimate();
    }
});
