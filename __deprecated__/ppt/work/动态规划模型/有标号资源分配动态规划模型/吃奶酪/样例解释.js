import * as sd from "@/sd";
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
const coord = new CheeseCoord(svg, data);
const path = new sd.Path(svg).arrow().stroke(C.textBlue);
const arr = new sd.Array(svg).start(1);
const pen = new sd.PathPen();

sd.init(() => {
    const start = new sd.Circle(svg).r(3).center(coord.global(0, 0));
    sd.Label(start, "s", "bc", 20, 0);
    pen.MoveTo(coord.global(0, 0));
    path.d(pen.toString());
    for (let i = 0; i < data.length; i++) {
        const circle = coord.element(i);
        const id = i;
        circle.onClick(() => {
            sd.inter(async () => {
                circle.startAnimate().color(C.blue).endAnimate();
                pen.LineTo(coord.global(data[id]));
                arr.startAnimate()
                    .push(id + 1)
                    .endAnimate();
                path.startAnimate().d(pen.toString()).endAnimate();
            });
            circle.onClick(null);
        });
    }
    arr.x(coord.x()).y(coord.my() + 40);
});

sd.main(async () => {});
