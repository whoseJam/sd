import * as sd from "@/sd";
import { Space } from "../_/Space";

const inputData = `
-15 0 5 10
-5 8 20 25
15 -4 24 14
0 -6 16 4
2 15 10 22
30 10 36 20
34 0 40 16
`;
const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const n = 7;
const space = new Space(svg).viewBox({ x: -16, y: -7, width: 60, height: 35 });
const offset = -space.viewBox().x;
const grad = C.gradient(C.white, C.textBlue, 0, 4);
const arr = new sd.Array(svg)
    .x(space.x())
    .y(space.my() + 10)
    .resize(space.viewBox().width - 1);
const data = I.readIntMatrix(inputData, n, 4, true);
const nodes = [];
const segment = sd.make1d(space.viewBox().width - 1, 0);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        const item = data[i];
        const [x1, y1, x2, y2] = [item[1], item[2], item[3], item[4]];
        const rect = space.addRect(x1, y1, x2 - x1, y2 - y1);
        nodes.push({
            rect,
            xl: x1,
            xr: x2,
            y: y1,
            type: +1,
        });
        nodes.push({
            rect,
            xl: x1,
            xr: x2,
            y: y2,
            type: -1,
        });
    }
    arr.opacity(0);
});

sd.main(async () => {
    nodes.sort((a, b) => {
        return a.y - b.y;
    });
    await sd.pause();
    const line = new sd.Line(svg).stroke(C.red).strokeWidth(10).source(space.pos("x", "my")).target(space.pos("mx", "my")).opacity(0).startAnimate().opacity(1).endAnimate();
    arr.startAnimate().opacity(1).endAnimate();
    for (let l = 0, r; l < nodes.length; l = r + 1) {
        r = l;
        while (r + 1 < nodes.length && nodes[r + 1].y === nodes[l].y) r++;
        await sd.pause();
        const node = nodes[l];
        line.startAnimate().y(space.globalY(node.y)).endAnimate();
        const y = line.y();

        const before = segment.map(item => item > 0);
        for (let k = l; k <= r; k++) {
            await sd.pause();
            const brace = new sd.BraceCurve(svg).strokeWidth(5);
            brace.source(arr.element(nodes[k].xl + offset).x(), y - 10);
            brace.target(arr.element(nodes[k].xr + offset).x(), y - 10);
            brace.startAnimate().pointStoT().endAnimate();
            const line1 = new sd.Line(svg)
                .strokeWidth(5)
                .source(brace.source())
                .target(arr.element(nodes[k].xl + offset).x(), arr.y())
                .opacity(0)
                .strokeDashArray([10, 10])
                .startAnimate()
                .opacity(1)
                .endAnimate();
            const line2 = new sd.Line(svg)
                .strokeWidth(5)
                .source(brace.target())
                .target(arr.element(nodes[k].xr + offset).x(), arr.y())
                .opacity(0)
                .strokeDashArray([10, 10])
                .startAnimate()
                .opacity(1)
                .endAnimate();
            await sd.pause();
            arr.startAnimate();
            for (let i = nodes[k].xl; i < nodes[k].xr; i++) {
                segment[i + offset] += nodes[k].type;
                arr.color(i + offset, grad(segment[i + offset]));
            }
            arr.endAnimate();
            await sd.pause();
            brace.startAnimate().fadeStoT().endAnimate().remove();
            line1.startAnimate().opacity(0).endAnimate().remove();
            line2.startAnimate().opacity(0).endAnimate().remove();
        }
        const after = segment.map(item => item > 0);
        await sd.pause();
        for (let i = 0; i < segment.length; i++) {
            if (before[i] !== after[i]) new sd.Line(svg).source(arr.element(i).x(), y).target(arr.element(i).mx(), y).opacity(0).stroke(C.textBlue).strokeWidth(8).startAnimate().opacity(1).endAnimate();
        }
    }
});
