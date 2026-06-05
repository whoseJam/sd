import * as sd from "@/sd";
import { linkToWithArrow } from "../../_/LinkTo";
import { tarjan } from "../_/Tarjan";
import { TreeGraph } from "../_/TreeGraph";

const svg = sd.svg();
const C = sd.color();
const n = 9;
const links = [
    [1, 2],
    [2, 3],
    [3, 4],
    [3, 5],
    [5, 6],
    [2, 7],
    [1, 8],
    [8, 9],
];
const externLinks = [
    [3, 6, sd.Curve],
    [7, 1, sd.Line],
    [9, 8, sd.Curve],
];
const tree = new TreeGraph(svg, n, links, externLinks);
const treeLinks = [];
const ancestorLinks = [];

sd.init(() => {});

sd.main(async () => {
    await tarjan(tree, {
        onTreeLink(u, v, link) {
            if (tree.sourceId(link) !== String(u)) link.reversed = true;
            else link.reversed = false;
            treeLinks.push(link);
        },
        onAncestorLink(u, v, link) {
            if (tree.sourceId(link) !== String(u)) link.reversed = true;
            else link.reversed = false;
            ancestorLinks.push(link);
        },
    });
    await sd.pause();
    treeLinks.forEach(link => linkToWithArrow(link, C.textBlue));
    await sd.pause();
    ancestorLinks.forEach(link => linkToWithArrow(link, C.red));
});
