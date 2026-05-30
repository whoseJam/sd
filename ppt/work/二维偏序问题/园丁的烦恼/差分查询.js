import * as sd from "@/sd";
import { Plane } from "../_/Plane";

const svg = sd.svg();
const C = sd.color();
const mn = [3, 4];
const mx = [9, 7];
const data = [
    [1, 2],
    [3, 1],
    [5, 3],
    [2, 7],
    [4, 5],
    [7, 2],
    [6, 6],
    [10, 5],
    [8, 4],
    [7, 6],
];
const rect = new sd.Rect(svg).fillOpacity(0.5).strokeOpacity(0).fill(C.red).opacity(0);
const query = new sd.Rect(svg).fillOpacity(0.5).strokeOpacity(0).fill(C.green).opacity(0);
const plane = new Plane(svg, data);

sd.init(() => {
    sd.Label(plane.axis("x"), "x轴", "rc");
    sd.Label(plane.axis("y"), "y轴", "tc");
});

sd.main(async () => {
    await sd.pause();
    focus(rect, mn[0], mn[1], mx[0], mx[1]);
    await sd.pause();
    draw(mn[0] - 1, mn[1] - 1, C.red);
    draw(mn[0] - 1, mx[1] - 1, C.blue);
    draw(mx[0] - 1, mn[1] - 1, C.blue);
    draw(mx[0] - 1, mx[1] - 1, C.red);
    await sd.pause();
    focus(query, 1, 1, mx[0], mx[1]);
    await sd.pause();
    focus(query, 1, 1, mn[0], mx[1]);
    await sd.pause();
    focus(query, 1, 1, mx[0], mn[1]);
    await sd.pause();
    focus(query, 1, 1, mn[0], mn[1]);
});

function draw(x, y, color) {
    plane
        .drawRect(x + 0.5, y + 0.5)
        .width(12)
        .height(12)
        .opacity(0)
        .color(color)
        .startAnimate()
        .opacity(1)
        .endAnimate();
}

function focus(rect, x1, y1, x2, y2) {
    const p1 = plane.global(x1, y2);
    const p2 = plane.global(x2, y1);
    if (rect.opacity() === 0) {
        rect.x(p1[0]).y(p1[1]);
        rect.width(p2[0] - p1[0]);
        rect.height(p2[1] - p1[1]);
        rect.startAnimate().opacity(1).endAnimate();
    } else {
        rect.startAnimate();
        rect.x(p1[0]).y(p1[1]);
        rect.width(p2[0] - p1[0]);
        rect.height(p2[1] - p1[1]);
        rect.endAnimate();
    }
}
