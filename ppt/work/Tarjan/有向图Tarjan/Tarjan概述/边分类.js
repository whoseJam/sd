import * as sd from "@/sd";
import { linkTo } from "../../_/LinkTo";
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
    [9, 7, sd.Line],
];
const tree = new TreeGraph(svg, n, links, externLinks);
const treeLinks = [];
const ancestorLinks = [];
const forwardLinks = [];
const crossLinks = [];

sd.init(() => {});

sd.main(async () => {
    await tarjan(tree, {
        onTreeLink(u, v, link) {
            treeLinks.push(link);
        },
        onAncestorLink(u, v, link) {
            ancestorLinks.push(link);
        },
        onForwardLink(u, v, link) {
            forwardLinks.push(link);
        },
        onCrossLink(u, v, link) {
            crossLinks.push(link);
        },
    });
    await sd.pause();
    treeLinks.forEach(link => linkTo(link, C.textBlue));
    await sd.pause();
    forwardLinks.forEach(link => linkTo(link, C.orange));
    await sd.pause();
    ancestorLinks.forEach(link => linkTo(link, C.red));
    await sd.pause();
    crossLinks.forEach(link => linkTo(link, C.purple));
});
