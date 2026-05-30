import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 9;
const arr = new sd.Array(svg).resize(n).start(1);
const ranges = [
    [1, 3],
    [4, 7],
];

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    const braces = [];
    for (let i = 0; i < ranges.length; i++) {
        braces.push(sd.Brace(arr).startAnimate().brace(ranges[i][0], ranges[i][1], "b"));
    }
    await sd.pause();
    const rangeIndex = ranges.length - 1;
    sd.Pointer(arr, "i", "b", 5, 30, 5).startAnimate().moveTo(ranges[rangeIndex][1]).endAnimate();
    sd.Pointer(arr, "j", "b", 5, 30, 5)
        .startAnimate()
        .moveTo(ranges[rangeIndex][0] - 1)
        .endAnimate();

    const value = new sd.Math(svg, "{(} {i} {-} {(j{+1})} {+} {\\sum_{k=j+1}^iC_k} {-L} {)} ^ {2}").fontSize(15);
    braces[rangeIndex].startAnimate().value(value).endAnimate();
    arr.startAnimate().color(ranges[rangeIndex][0], ranges[rangeIndex][1], C.blue).endAnimate();

    await sd.pause();
    value.startAnimate().transformMath("{(} {i} {-} {j} {+} {\\sum_{k=j+1}^iC_k} {-1} {-L} {)} ^ {2}", { 1: 1, 2: 2, 3: 3, 4: 4, 5: 8, 6: 5, 7: 6, 9: 9, 10: 10, 11: 11 }).endAnimate();
    await sd.pause();
    value.startAnimate().transformMath("{(} {\\sum_{k=j+1}^i(C_k {+} {1})} {-1} {-L} {)} ^ {2}", { 1: 1, 2: 5, 3: 4, 4: 5, 5: 4, 6: 2, 8: 6, 9: 7, 10: 8, 11: 9 }).endAnimate();
});
