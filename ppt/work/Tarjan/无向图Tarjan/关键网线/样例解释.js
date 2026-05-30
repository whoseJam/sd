import * as sd from "@/sd";
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
    [4, 1, sd.Line],
    [7, 6, sd.Line],
    [6, 3, sd.Curve],
];
const A = [1, 2, 4, 6, 8];
const B = [9, 3, 6, 7, 8];
const tree = new TreeGraph(svg, n, links, externLinks);

sd.init(() => {
    A.forEach(a => {
        const node = tree.element(a);
        const mark = makeA(node.background());
        mark.x(node.x()).y(node.y());
    });
    B.forEach(b => {
        const node = tree.element(b);
        const mark = makeB(node.background());
        mark.x(node.cx()).y(node.y());
    });
});

sd.main(async () => {
    await sd.pause();
    tree.element(2, 5).startAnimate().strokeDashArray([5, 5]).endAnimate();
});

function makeA(target) {
    const pen = new sd.PathPen().MoveTo(0, 0).Arc([20, 20], -90, 0, 0, [0, 40]).LineTo(0, 0);
    const path = new sd.Path(target).d(pen.toString()).fill(C.blue).strokeOpacity(0).fillOpacity(0.8);
    return path;
}

function makeB(target) {
    const pen = new sd.PathPen().MoveTo(0, 0).Arc([20, 20], -90, 0, 1, [0, 40]).LineTo(0, 0);
    const path = new sd.Path(target).d(pen.toString()).fill(C.red).strokeOpacity(0).fillOpacity(0.8);
    return path;
}
