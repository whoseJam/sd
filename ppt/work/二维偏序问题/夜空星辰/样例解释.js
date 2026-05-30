import * as sd from "@/sd";
import { Plane } from "../_/Plane";

const svg = sd.svg();
const C = sd.color();
const data = [
    [1, 2],
    [3, 1],
    [5, 3],
    [2, 7],
    [4, 9],
    [10, 5],
    [8, 4],
    [7, 6],
];
const at = 5;
const [x, y] = data[at];
const w = 60;
const rect = new sd.Rect(svg).fillOpacity(0.5).strokeOpacity(0).fill(C.red).opacity(0);
const plane = new Plane(svg, data).gap("x", w).elementHeight(50);

sd.init(() => {
    sd.Label(plane.axis("x"), "x轴", "rc");
    sd.Label(plane.axis("y"), "y轴", "tc");
});

sd.main(async () => {
    await sd.pause();
    sd.Label(plane.circles()[at], "$(x_i,y_i)$", "tc", 15).opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    rect.x(plane.globalX(x + 0.5))
        .y(plane.globalY(y + 0.5))
        .opacity(1)
        .width(0)
        .height(plane.globalY(0) - plane.globalY(y - 0.5))
        .startAnimate()
        .x(plane.globalX(1))
        .width(plane.globalX(x - 0.5) - plane.globalX(0))
        .endAnimate();
});
