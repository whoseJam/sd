import * as sd from "@/sd";
import { MergeAnalyzer, mergeText } from "../_/MergeAnalyzer";

const svg = sd.svg();
const C = sd.color();
const n = 8;
const data = [" ", -2, 3, 3, -1, 3, 3, -5, 2];
const tree = new MergeAnalyzer(svg, n, data);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    tree.startAnimate();
    tree.element(2).startAnimate().color(2, 4, C.orange).endAnimate();
    tree.element(3).startAnimate().color(5, 6, C.orange).endAnimate();
    tree.endAnimate();
    await sd.pause();
    tree.startAnimate();
    mergeText(tree);
    tree.element(1).color(2, 6, C.orange);
    tree.endAnimate();
});
