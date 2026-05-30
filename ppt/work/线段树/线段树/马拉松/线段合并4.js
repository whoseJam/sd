import * as sd from "@/sd";
import { MergeAnalyzer, mergeText } from "../_/MergeAnalyzer";

const svg = sd.svg();
const n = 8;
const mid = (1 + n) >> 1;
const C = sd.color();
const tree = new MergeAnalyzer(svg, n, " 12345678");

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    tree.startAnimate();
    mergeText(tree);
    tree.endAnimate();
    addPath(tree.element(1), 4, 6, C.red);
});

function addPath(array, l, r, color) {
    sd.Link(array.element(l), array.element(r), sd.Curve, "cx", "my", "cx", "my")
        .bending(0.2 + 0.2)
        .color(color)
        .startAnimate()
        .pointStoT()
        .endAnimate()
        .arrow();
}
