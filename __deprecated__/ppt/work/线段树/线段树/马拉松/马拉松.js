import * as sd from "@/sd";
import { MergeAnalyzer, mergeText } from "../_/MergeAnalyzer";

const svg = sd.svg();
const grid = new sd.GridGraph(svg).width(200).height(150);
const n = 8;
const mid = (1 + n) >> 1;
const C = sd.color();
const tree = new MergeAnalyzer(svg, n, " 12345678");

sd.init(() => {
    grid.at(0, 0).newNode(1);
    grid.at(0.5, 0).newNode(2);
    grid.at(1, 1).newNode(3);
    grid.at(1, 0.5).newNode(4);
    grid.at(1, 0).newNode(5);
    grid.at(0.5, 1).newNode(6);
    grid.at(0, 0.5).newNode(7);
    grid.at(0, 1).newNode(8);
    for (let i = 1; i <= 7; i++)
        grid.newLink(i, i + 1)
            .element(i, i + 1)
            .arrow();
    grid.cx(tree.cx()).y(tree.my() + 60);
});

sd.main(async () => {
    await sd.pause();
    addPath(tree.element(2), 1, mid, C.textBlue);
    addPath(tree.element(3), mid + 1, n, C.textBlue);
    await sd.pause();
    tree.startAnimate();
    mergeText(tree);
    tree.endAnimate();
    addPath(tree.element(1), 1, mid, C.textBlue);
    addPath(tree.element(1), mid + 1, n, C.textBlue);
    addPath(tree.element(1), mid, mid + 1, C.green);
});

function addPath(array, l, r, color) {
    for (let i = l; i < r; i++) {
        sd.Link(array.element(i), array.element(i + 1), sd.Curve, "cx", "my", "cx", "my")
            .bending(0.8)
            .color(color)
            .startAnimate()
            .pointStoT()
            .endAnimate()
            .arrow();
    }
}
