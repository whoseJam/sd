import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [4, -3, -2, 5, -4];
const segments = [
    [0, 1],
    [3, 4],
];
const array = new sd.Array(svg).pushArray(data);

sd.init(() => {
    array.x(100).y(100);
});

sd.main(async () => {
    await sd.pause();
    let totalLength = 0;
    for (const [start, end] of segments) {
        const brace = sd.Brace(array);
        brace.startAnimate().brace(start, end).endAnimate();
        totalLength += end - start + 1;
    }
    const text = new sd.Text(svg);
    text.text(`Total Length: ${totalLength}`)
        .cx(array.cx())
        .y(array.my() + 20);
    text.opacity(0).startAnimate().opacity(1).endAnimate();
});
