import * as sd from "@/sd";
import { BinaryString } from "../_/BinaryString";
import { CheeseCoord } from "./CheeseCoord";

const svg = sd.svg();
const C = sd.color();
const data = [
    [-1, 1],
    [2, -1],
    [3, 0],
    [0, 1],
    [2, 0],
    [1, 0],
];
const mask = [1, 2, 5];
const n = data.length;
const posI = 5;
const posJ = 3;
const coord = new CheeseCoord(svg, data);
const status = new BinaryString(svg, n);
const path = new sd.Path(svg).arrow().stroke(C.textBlue);
const pen = new sd.PathPen();

sd.init(() => {
    const start = new sd.Circle(svg).r(3).center(coord.global(0, 0));
    sd.Label(start, "s", "bc", 20, 0);
    status.cx(coord.cx()).y(coord.my() + 40);
    pen.MoveTo(coord.global(0, 0));
    mask.forEach(i => {
        status.value(i, 1);
        coord.element(i - 1).color(C.grey);
        pen.LineTo(coord.global(data[i - 1]));
    });
    path.d(pen.toString());
});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(coord, "i")
        .startAnimate()
        .moveTo(posI - 1)
        .endAnimate();
    coord
        .element(posI - 1)
        .startAnimate()
        .strokeWidth(3)
        .stroke(C.red)
        .endAnimate();
    await sd.pause();
    sd.Pointer(coord, "j")
        .startAnimate()
        .moveTo(posJ - 1)
        .endAnimate();
    await sd.pause();
    pen.LineTo(coord.global(data[posJ - 1]));
    path.startAnimate().d(pen.toString()).endAnimate();
    await sd.pause();
    status.startAnimate().value(posJ, 1).endAnimate();
    coord
        .element(posI - 1)
        .startAnimate()
        .strokeWidth(1)
        .stroke(C.black)
        .endAnimate();
    coord
        .element(posJ - 1)
        .startAnimate()
        .strokeWidth(3)
        .stroke(C.red)
        .color(C.grey)
        .endAnimate();
});
