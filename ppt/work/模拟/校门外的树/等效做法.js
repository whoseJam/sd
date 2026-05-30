import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 50;
const arr = new sd.Array(svg).resize(n).start(1);
const rect = new sd.Rect(svg);
const colors = [C.blue, C.yellow];
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

sd.init(() => {
    sd.Label(rect, "当前时间戳");
    rect.cx(arr.cx()).my(arr.y() - 20);
});

sd.main(async () => {
    const brace = sd.Brace(arr);
    for (const segments of data) {
        const i = data.indexOf(segments);
        const color = colors[i];
        await sd.pause();
        rect.startAnimate().color(color).endAnimate();
        for (const segment of segments) {
            const [l, r] = segment;
            await sd.pause();
            brace.startAnimate().brace(l, r).endAnimate();
            arr.startAnimate().color(l, r, color).endAnimate();
            await sd.pause();
            brace.startAnimate().opacity(0).endAnimate();
        }
    }
});
