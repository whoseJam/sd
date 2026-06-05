import * as sd from "@/sd";
import { interactableIntervalMove } from "../_/InteractableIntervalMove";
import { BallCoord } from "./BallCoord";

const svg = sd.svg();
const C = sd.color();
const balls = [[1, 5], [2, 4], undefined, [4, 6], [5, 1], [6, 5], [8, 3], [10, 4]];
const circles = new BallCoord(svg, balls);
const start = 2;
let gap = 5;

sd.init(() => {
    interactableIntervalMove(circles, start, { onMove });
});

sd.main(async () => {});

async function onMove(s, t) {
    const es = circles.element(s);
    const et = circles.element(t);
    et.startAnimate().color(C.grey).endAnimate();
    const line = new sd.Line(svg);
    if (es === undefined) line.source((circles.element(s - 1).cx() + circles.element(s + 1).cx()) / 2, 50 - gap);
    else line.source(es.cx(), 50 - gap);
    line.target(et.cx(), 50 - gap);
    line.startAnimate().pointStoT().endAnimate().arrow();
    gap += 5;
}
