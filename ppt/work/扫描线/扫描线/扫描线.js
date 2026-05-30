import * as sd from "@/sd";
import { Space } from "../_/Space";

const svg = sd.svg();
const C = sd.color();
const space = new Space(svg).viewBox({ x: 0, y: 0, width: 20, height: 10 });
const grad = C.gradient(C.white, C.orange, 0, 2);
const arr = new sd.Array(svg)
    .x(space.x())
    .y(space.my() + 10)
    .resize(space.viewBox().width - 1);
const data = [
    [1, 1, 5, 3],
    [8, 5, 7, 2],
    [13, 6, 4, 3],
];
const nodes = [];
const segment = sd.make1d(space.viewBox().width - 1, 0);

sd.init(() => {
    data.forEach(item => {
        const rect = space.addRect(item[0], item[1], item[2], item[3]);
        nodes.push({
            rect,
            xl: item[0],
            xr: item[0] + item[2],
            y: item[1],
            type: +1,
        });
        nodes.push({
            rect,
            xl: item[0],
            xr: item[0] + item[2],
            y: item[1] + item[3],
            type: -1,
        });
    });
    arr.opacity(0);
});

sd.main(async () => {
    nodes.sort((a, b) => {
        return a.y - b.y;
    });
    await sd.pause();
    const line = new sd.Line(svg).stroke(C.red).strokeWidth(3).source(space.pos("x", "my")).target(space.pos("mx", "my")).opacity(0).startAnimate().opacity(1).endAnimate();
    arr.startAnimate().opacity(1).endAnimate();
    for (let i = 0; i < nodes.length; i++) {
        await sd.pause();
        const node = nodes[i];
        const y1 = line.y();
        line.startAnimate().y(space.globalY(node.y)).endAnimate();
        const y2 = line.y();
        for (let l = 0, r; l < arr.length(); l = r + 1) {
            r = l;
            if (segment[l] === 0) continue;
            while (r + 1 < segment.length && segment[r + 1] > 0) r++;
            new sd.Rect(svg)
                .color(C.orange)
                .opacity(0.5)
                .width(arr.element(r).mx() - arr.element(l).x())
                .height(0)
                .x(arr.element(l).x())
                .y(y1)
                .startAnimate()
                .height(y1 - y2)
                .my(y1)
                .endAnimate();
        }
        await sd.pause();
        arr.startAnimate();
        for (let j = node.xl; j < node.xr; j++) {
            segment[j] += node.type;
            arr.color(j, grad(segment[j]));
        }
        arr.endAnimate();
    }
});
