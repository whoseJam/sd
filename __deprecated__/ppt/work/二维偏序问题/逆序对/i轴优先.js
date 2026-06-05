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
const sum = new sd.Pile(svg).resize(plane.countY()).start(1).elementWidth(plane.gap("y")).elementHeight(plane.gap("y")).start(plane.minY());

sd.init(() => {
    sd.Label(plane.axis("x"), "a轴", "rc");
    sd.Label(plane.axis("y"), "i轴", "tc");
    sum.mx(plane.x()).my(plane.my());
});

sd.main(async () => {});
