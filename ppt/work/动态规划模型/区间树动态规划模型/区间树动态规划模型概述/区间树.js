import * as sd from "@/sd";
import { buildIntervalTree } from "../_/BuildIntervalTree";

const svg = sd.svg();
const n = 10;
const arr = new sd.Array(svg).resize(n).start(1);
const intervals = [
    [1, 10],
    [1, 4],
    [5, 6],
    [7, 10],
    [1, 2],
    [3, 4],
    [5, 5],
    [6, 6],
    [7, 9],
    [10, 10],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [7, 8],
    [9, 9],
    [7, 7],
    [8, 8],
];

sd.init(() => {});

sd.main(async () => {
    await buildIntervalTree(arr, intervals, {
        onCreateNode,
        layerHeight: 30,
        initalLayerHeight: 20,
    });
});

async function onCreateNode(l, r, fa, cx, y) {
    await sd.pause();
    const rect = new sd.Rect(svg).width((r - l + 1) * 40 - 10).height(10);
    rect.cx(cx).y(y).opacity(0).startAnimate().opacity(1).endAnimate();
    if (fa) {
        const link = new sd.Line(svg);
        link.source(fa.pos("cx", "my"));
        link.target(rect.pos("cx", "y"));
        link.startAnimate().pointStoT().endAnimate().arrow();
    }
    return rect;
}
