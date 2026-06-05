import * as sd from "@/sd";
import { Plane } from "../_/Plane";

const svg = sd.svg();
const C = sd.color();
const data = [
    [1, 2],
    [2, 1],
    [3, 3],
    [4, 7],
    [5, 9],
    [6, 5],
    [7, 4],
    [8, 6],
];
const w = 60;
const plane = new Plane(svg, data).gap("x", w).elementHeight(50);

sd.init(() => {
    sd.Label(plane.axis("x"), "i轴", "rc");
    sd.Label(plane.axis("y"), "a轴", "tc");
});

sd.main(async () => {
    await sd.pause();
    sd.Label(plane.circles()[6], "$(i,a_i)$", "bc", 15).opacity(0).startAnimate().opacity(1).endAnimate();
});
