import * as sd from "@/sd";
import { MergeAnalyzer, mergeText } from "../_/MergeAnalyzer";

const svg = sd.svg();
const C = sd.color();
const n = 8;
const data = [" ", 2, 3, -5, -2, -5, 3, 3, 3];
const tree = new MergeAnalyzer(svg, n, data);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    tree.startAnimate();
    tree.element(3).startAnimate().color(6, 8, C.orange).endAnimate();
    tree.endAnimate();
    await sd.pause();
    tree.startAnimate();
    mergeText(tree);
    tree.element(1).color(6, 8, C.orange);
    tree.endAnimate();
});
