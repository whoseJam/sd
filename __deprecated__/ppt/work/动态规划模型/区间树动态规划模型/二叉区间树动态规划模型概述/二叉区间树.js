import * as sd from "@/sd";
import { buildIntervalTree } from "../_/BuildIntervalTree";

const svg = sd.svg();
const R_ = sd.rule();
const EN = sd.enter();
const n = 8;
const arr = new sd.Array(svg).resize(n).start(1);
const links = [];
const nodes = [];
const intervals = [
    [1, 8],
    [1, 5],
    [6, 8],
    [1, 3],
    [4, 5],
    [6, 7],
    [6, 6],
    [7, 7],
    [8, 8],
    [1, 1],
    [2, 3],
    [4, 4],
    [5, 5],
    [2, 2],
    [3, 3],
];
let root;
let L, LLink;
let R, RLink;

sd.init(() => {});

sd.main(async () => {
    await buildIntervalTree(arr, intervals, {
        onCreateNode,
        layerHeight: 30,
        initalLayerHeight: 20,
    });
    await sd.pause();
    nodes.forEach(node => node.startAnimate().opacity(0).endAnimate().remove());
    links.forEach(link => link.startAnimate().opacity(0).endAnimate().remove());
    const LRect = new sd.Rect(L).height(100);
    L.startAnimate().childAs(LRect, (parent, child) => {
        child.x(parent.x()).y(parent.my()).width(parent.width());
    });
    const RRect = new sd.Rect(R).height(100);
    R.startAnimate().childAs(RRect, (parent, child) => {
        child.x(parent.x()).y(parent.my()).width(parent.width());
    });
    await sd.pause();
    LRect.startAnimate().childAs(new sd.Text(LRect, "?").onEnter(EN.appear()), R_.centerOnly()).endAnimate();
    RRect.startAnimate().childAs(new sd.Text(RRect, "?").onEnter(EN.appear()), R_.centerOnly()).endAnimate();
    for (let i = 1; i < n; i++) {
        await sd.pause();
        L.startAnimate()
            .width((i - 1 + 1) * 40 - 10)
            .endAnimate();
        LLink.startAnimate().target(L.pos("cx", "y")).endAnimate();
        R.startAnimate()
            .width((n - i) * 40 - 10)
            .mx(arr.mx() - 5)
            .endAnimate();
        RLink.startAnimate().target(R.pos("cx", "y")).endAnimate();
    }
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
        if (fa === root) {
            if (l === 1) (L = rect), (LLink = link);
            if (r === n) (R = rect), (RLink = link);
        } else {
            links.push(link);
            nodes.push(rect);
        }
    } else root = rect;
    return rect;
}
