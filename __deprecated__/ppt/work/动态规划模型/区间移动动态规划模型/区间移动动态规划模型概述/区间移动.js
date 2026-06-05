import * as sd from "@/sd";
import { interactableIntervalMove } from "../_/InteractableIntervalMove";

const svg = sd.svg();
const C = sd.color();
const n = 10;
const arr = new sd.Array(svg).start(1);
const start = 5;
let gap = 5;

sd.init(() => {
    arr.resize(n);
    sd.Index(arr, "b");
    interactableIntervalMove(arr, start, { onMove });
});

sd.main(async () => {
    await sd.pause(sd.CONTINUE_STAGE);
    arr.startAnimate().color(start, C.grey).endAnimate();
});

async function onMove(s, t) {
    const es = arr.element(s);
    const et = arr.element(t);
    arr.startAnimate().color(t, C.grey).endAnimate();
    const line = new sd.Line(svg).source(es.cx(), es.y() - gap).target(et.cx(), et.y() - gap);
    line.startAnimate().pointStoT().endAnimate().arrow();
    gap += 5;
}
