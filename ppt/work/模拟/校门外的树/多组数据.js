import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 50;
const arr = new sd.Array(svg).resize(n).start(1);
const data = [
    [
        [1, 3],
        [12, 16],
        [29, 30],
    ],
    [
        [5, 6],
        [25, 27],
    ],
];

sd.init(() => {});

sd.main(async () => {
    const brace = sd.Brace(arr);
    for (const segments of data) {
        await sd.pause();
        arr.startAnimate().color(C.green).endAnimate();
        for (const segment of segments) {
            const [l, r] = segment;
            await sd.pause();
            brace.startAnimate().brace(l, r).endAnimate();
            arr.startAnimate().color(l, r, C.white).endAnimate();
            await sd.pause();
            brace.startAnimate().opacity(0).endAnimate();
        }
    }
});
