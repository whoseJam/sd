import * as sd from "@/sd";
import { linkToWithArrow } from "../../_/LinkTo";
import { tarjan } from "../_/Tarjan";
import { TreeGraph } from "../_/TreeGraph";

const svg = sd.svg();
const C = sd.color();
const n = 9;
const links = [
    [1, 2],
    [2, 4],
    [2, 5],
    [5, 8],
    [5, 3],
    [3, 6],
    [3, 7],
    [7, 9],
];
const externLinks = [
    [5, 1, sd.Line],
    [7, 6, sd.Line],
    [2, 3, sd.Line],
    [6, 3, sd.Curve],
];
const path = [1, 2, 5, 3, 6, 7, 9];
const answer = new Set([3, 7]);
const tree = new TreeGraph(svg, n, links, externLinks);

sd.init(() => {
    sd.Pointer(tree, "a", "r").moveTo(1);
    sd.Pointer(tree, "b", "l").moveTo(9);
});

sd.main(async () => {
    await sd.pause();
    await tarjan(tree, {
        onTreeLink(u, v, link) {
            if (tree.sourceId(link) !== String(u)) link.reversed = true;
            else link.reversed = false;
            linkToWithArrow(link, C.textBlue);
        },
        onAncestorLink(u, v, link) {
            if (tree.sourceId(link) !== String(u)) link.reversed = true;
            else link.reversed = false;
            linkToWithArrow(link, C.red);
        },
    });
    await sd.pause();
    tree.startAnimate();
    path.forEach(node => {
        tree.color(node, C.blue);
        const node_ = tree.element(node);
        node_.onClick(() => {
            node_.onClick(null);
            sd.inter(async () => {
                if (answer.has(+node)) return;
                node_.startAnimate().color(C.white).endAnimate();
            });
        });
    });
    tree.endAnimate();
});
