import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 9;
const arr = new sd.Array(svg).resize(n).start(1);
const rangeIndex = 1;
const ranges = [
    [1, 3],
    [4, 7],
    [8, 9],
];

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    const braces = [];
    for (let i = 0; i < ranges.length; i++) {
        braces.push(sd.Brace(arr).startAnimate().brace(ranges[i][0], ranges[i][1], "b"));
    }
    await sd.pause();
    sd.Pointer(arr, "i", "b", 5, 30, 5).startAnimate().moveTo(ranges[rangeIndex][0]).endAnimate();
    sd.Pointer(arr, "j", "b", 5, 30, 5).startAnimate().moveTo(ranges[rangeIndex][1]).endAnimate();
    braces[rangeIndex].startAnimate().value(new sd.Math(svg, "(j-i+\\sum_{k=i}^jC_k-L)^2").fontSize(15)).endAnimate();
    arr.startAnimate().color(ranges[rangeIndex][0], ranges[rangeIndex][1], C.blue).endAnimate();
});
