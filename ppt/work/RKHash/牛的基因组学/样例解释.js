import * as sd from "@/sd";

const C = sd.color();
const svg = sd.svg();
// 假设 n 和 m 已知，这里设置示例值
const n = 3;
const m = 8;
// 示例基因数据
const spottedCowsGenes = ["AATCCCAT", "ACTTGCAA", "GGTCGCAA"];
const nonSpottedCowsGenes = ["ACTCCCAG", "ACTCGCAT", "ACTTCCAT"];
const spotted = new sd.ValueStack(svg).x(100).y(100).align("x");
const nonSpotted = new sd.ValueStack(svg).x(100).y(100).align("x");
const startInput = new sd.Input(svg);
const endInput = new sd.Input(svg);
const button = new sd.Button(svg);

sd.init(() => {
    // 填充斑点奶牛基因
    spottedCowsGenes.forEach(gene => {
        const arr = new sd.Array(svg).pushArray(gene);
        spotted.push(arr);
    });
    // 填充非斑点奶牛基因
    nonSpottedCowsGenes.forEach(gene => {
        const arr = new sd.Array(svg).pushArray(gene);
        nonSpotted.push(arr);
    });
    nonSpotted.y(spotted.my() + 20);
    startInput.x(nonSpotted.x()).y(nonSpotted.my() + 20);
    endInput.x(nonSpotted.x()).y(startInput.my() + 20);
    button.x(nonSpotted.x()).y(endInput.my() + 20);
    // sd.Label(startInput, "左端点", "rc");
    // sd.Label(endInput, "右端点", "rc");

    button.onClick(() => {
        const start = parseInt(startInput.value());
        const end = parseInt(endInput.value());
        if (isNaN(start) || isNaN(end) || start > end || start < 1 || end > m) return;
        sd.inter(async () => {
            // 先对选定区间进行涂色
            spotted.forEachElement(arr => {
                for (let i = start - 1; i < end; i++) {
                    arr.element(i).startAnimate().color(C.red).endAnimate();
                }
            });
            nonSpotted.forEachElement(arr => {
                for (let i = start - 1; i < end; i++) {
                    arr.element(i).startAnimate().color(C.red).endAnimate();
                }
            });
            await sd.pause();
            // 再将所有基因设置为默认颜色
            spotted.forEachElement(arr => {
                arr.startAnimate().color(C.white).endAnimate();
            });
            nonSpotted.forEachElement(arr => {
                arr.startAnimate().color(C.white).endAnimate();
            });
        });
    });
});

sd.main(async () => {});
