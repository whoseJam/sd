import * as sd from "@/sd";
import { Plane } from "../_/Plane";

const svg = sd.svg();
const C = sd.color();
const data = [
    [1, 1],
    [2, 2],
    [2, 3],
    [4, 7],
    [4, 4],
    [6, 5],
    [8, 6],
    [4, 2],
];
const query = [5, 2, 7];
const w = 60;
const rect = new sd.Rect(svg).fillOpacity(0.5).fill(C.red).strokeOpacity(0).opacity(0);
const plane = new Plane(svg, data).gap("x", w).elementHeight(50);

sd.init(() => {
    sd.Label(plane.axis("x"), "p轴", "rc");
    sd.Label(plane.axis("y"), "i轴", "tc");
});

sd.main(async () => {
    await sd.pause();
    const [x, y1, y2] = query;
    sd.Pointer(svg, "$L_j$", "t")
        .startAnimate()
        .moveTo(plane.axis("x").tick(x))
        .endAnimate()
        .after(0)
        .dx(w / 2);
    await sd.pause();
    rect.width(0)
        .height(plane.height())
        .mx(plane.globalX(x - 0.5))
        .my(plane.globalY(1))
        .opacity(1)
        .startAnimate()
        .width(plane.globalX(x - 1.5) - plane.globalX(0))
        .mx(plane.globalX(x - 0.5))
        .endAnimate();
    await sd.pause();
    sd.Pointer(svg, "$L_j$", "r").startAnimate().moveTo(plane.axis("y").tick(y1)).endAnimate().after(0).dy(-15);
    sd.Pointer(svg, "$R_j$", "r").startAnimate().moveTo(plane.axis("y").tick(y2)).endAnimate().after(0).dy(-15);
    rect.startAnimate()
        .y(plane.globalY(y2 + 0.5))
        .height(plane.globalY(y1) - plane.globalY(y2))
        .endAnimate();
});
