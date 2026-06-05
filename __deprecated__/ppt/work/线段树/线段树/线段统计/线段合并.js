import * as sd from "@/sd";
import { MergeAnalyzer, mergeText } from "../_/MergeAnalyzer";

const svg = sd.svg();
const C = sd.color();
const n = 8;
const data = "10001101";
const tree = new MergeAnalyzer(svg, n, " " + data);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    tree.startAnimate();
    for (let i = 0; i < 4; i++) if (data[i] == "1") tree.element(2).color(i + 1, C.orange);
    for (let i = 4; i < 8; i++) if (data[i] == "1") tree.element(3).color(i + 1, C.orange);
    tree.endAnimate();
    await sd.pause();
    tree.startAnimate();
    mergeText(tree);
    for (let i = 0; i < 8; i++) if (data[i] == "1") tree.element(1).color(i + 1, C.orange);
    tree.endAnimate();
});
