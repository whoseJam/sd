import * as sd from "@/sd";
import { interactableIntervalMove } from "../_/InteractableIntervalMove";
import { LightArray } from "./LightArray";

const svg = sd.svg();
const C = sd.color();
const D = sd.device();
const lights = [1, 2, 4, 5, 6, 8, 10];
const circles = new LightArray(svg, lights);
const start = 4;
let gap = 5;

sd.init(() => {
    interactableIntervalMove(circles, start, { onMove });
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_STAGE);
    circles.element(start).startAnimate().stroke(C.red).strokeWidth(3).color(C.grey).endAnimate();
});

async function onMove(s, t) {
    const es = circles.element(s);
    const et = circles.element(t);
    et.startAnimate().color(C.grey).endAnimate();
    const line = new sd.Line(svg).source(es.cx(), es.y() - gap).target(et.cx(), et.y() - gap);
    line.startAnimate().pointStoT().endAnimate().arrow();
    gap += 5;
}
