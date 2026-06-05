import * as sd from "@/sd";
import { MergeAnalyzer, mergeText } from "../_/MergeAnalyzer";

const svg = sd.svg();
const C = sd.color();
const n = 8;
const data = [" ", 2, 3, 3, -5, -5, 3, -5, 3];
const tree = new MergeAnalyzer(svg, n, data);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    tree.startAnimate();
    tree.element(2).startAnimate().color(1, 3, C.orange).endAnimate();
    tree.endAnimate();
    await sd.pause();
    tree.startAnimate();
    mergeText(tree);
    tree.element(1).color(1, 3, C.orange);
    tree.endAnimate();
});
