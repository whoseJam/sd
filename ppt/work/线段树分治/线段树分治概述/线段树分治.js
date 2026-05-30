import * as sd from "@/sd";
import { SegmentTree } from "../_/SegmentTree";
import { Timeline } from "../_/Timeline";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const n = 8;
const tree = new SegmentTree(svg, n).cx(600).cy(200);
const timeline = new Timeline(svg, n);
sd.Label(timeline, "时间线");

sd.init(() => {
    timeline.cx(tree.cx()).y(tree.my() + 60);
});

sd.main(async () => {
    await addImpact(2, 5, C.green);
    await addImpact(3, 7, C.blue);
    await addImpact(4, 8, C.orange);
    await tree.dfsAysnc();
});

let cnt = 0;
async function addImpact(l, r, color) {
    const item = () => new sd.Circle(svg).color(color).r(5);
    await sd.pause();
    timeline.startAnimate();
    timeline.color(l, r, color);
    timeline.brace(l, r, cnt++ * 25 + 10, item());
    timeline.endAnimate();
    await sd.pause();
    tree.startAnimate().insert(l, r, item).endAnimate();
    timeline.startAnimate().color(l, r, C.white).endAnimate();
}
