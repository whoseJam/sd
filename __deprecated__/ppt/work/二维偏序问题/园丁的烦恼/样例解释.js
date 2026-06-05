import * as sd from "@/sd";
import { Plane } from "../_/Plane";

const svg = sd.svg();
const C = sd.color();
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
const plane = new Plane(svg, data);

sd.init(() => {
    sd.Label(plane.axis("x"), "x轴", "rc");
    sd.Label(plane.axis("y"), "y轴", "tc");
});

sd.main(async () => {
    while (true) {
        const x1 = sd.rand(plane.minX(), plane.maxX());
        const x2 = sd.rand(plane.minX(), plane.maxX());
        const y1 = sd.rand(plane.minY(), plane.maxY());
        const y2 = sd.rand(plane.minY(), plane.maxY());
        await sd.pause();
        const [x1_, y1_, x2_, y2_] = fix(x1, y1, x2, y2);
        focus(x1_, y1_, x2_, y2_);
    }
});

function fix(x1, y1, x2, y2) {
    if (x1 === x2) {
        if (x1 > plane.minX()) x1--;
        else x2++;
    } else if (x1 > x2) [x1, x2] = [x2, x1];
    if (y1 === y2) {
        if (y1 > plane.minY()) y1--;
        else y2++;
    } else if (y1 > y2) [y1, y2] = [y2, y1];
    return [x1, y1, x2, y2];
}

function focus(x1, y1, x2, y2) {
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
