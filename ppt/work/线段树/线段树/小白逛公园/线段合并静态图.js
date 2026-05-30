import * as sd from "@/sd";
import { MergeAnalyzer, mergeText } from "../_/MergeAnalyzer";

const svg = sd.svg();
const C = sd.color();
const n = 8;
const data = [" ", -2, 3, 3, -1, 3, 3, -5, 2];
const tree = new MergeAnalyzer(svg, n, data);

sd.init(() => {
    tree.element(2).color(2, 4, C.orange);
    tree.element(3).color(5, 6, C.orange);
    mergeText(tree);
    tree.element(1).color(2, 6, C.orange);
});

sd.main(async () => {});
