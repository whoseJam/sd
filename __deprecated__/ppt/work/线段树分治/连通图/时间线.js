import * as sd from "@/sd";
import { Timeline } from "../_/Timeline";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const timeline = new Timeline(svg, n);
const data = [3, 6, 8];
sd.Label(timeline, "时间线");

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    timeline.startAnimate();
    data.forEach(item => {
        timeline.color(item, C.red);
    });
    timeline.endAnimate();

    for (let i = 0; i <= data.length; i++) {
        const l = i === 0 ? 1 : data[i - 1] + 1;
        const r = i === data.length ? n : data[i] - 1;
        if (l <= r) await addImpact(l, r, 2, 5);
    }
});

async function addImpact(l, r, x, y) {
    await sd.pause();
    const item = () => {
        const line = new sd.Line(svg).source(0, 0).target(30, 0);
        const v1 = new sd.Vertex(svg, x).r(10);
        const v2 = new sd.Vertex(svg, y).r(10);
        line.childAs(v1, (parent, child) => {
            child.center(parent.source());
        });
        line.childAs(v2, (parent, child) => {
            child.center(parent.target());
        });
        line.v1 = x;
        line.v2 = y;
        return line;
    };
    timeline.startAnimate().brace(l, r, 10, item(), 10).endAnimate();
}
