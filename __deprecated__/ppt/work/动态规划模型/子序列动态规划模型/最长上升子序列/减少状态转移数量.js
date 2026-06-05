import * as sd from "@/sd";
import { bucketOptimize } from "../_/BucketOptimize";

const svg = sd.svg();
const C = sd.color();
const maxValue = 6;
const data = [2, 1, 4, 3, 2, 5, 6, 4];
const arr = new sd.Array(svg).x(100).y(200).start(1);
let firstBucket;

sd.init(() => {
    arr.pushArray(data);
});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(arr, "i", "t").startAnimate().moveTo(data.length).endAnimate();
    await sd.pause();
    const pj = sd.Pointer(arr, "j", "t");
    for (let i = 1; i < arr.length(); i++) {
        arr.startAnimate();
        pj.moveTo(i);
        arr.color(i, arr.intValue(i) < arr.intValue(arr.end()) ? C.green : C.red);
        arr.endAnimate();
    }
    await sd.pause();
    pj.startAnimate().moveTo(null).endAnimate();
    await sd.pause();
    await bucketOptimize(arr, data.length, {
        onCreateFirstBucket,
        onUpdateBucket,
        onUpdateCurrent,
    });
});

async function onCreateFirstBucket(arr, cx) {
    const pile = new sd.Pile(svg).elementWidth(15).elementHeight(15).resize(maxValue).start(1);
    pile.cx(cx).my(arr.y() - 5);
    for (let i = 1; i <= maxValue; i++) sd.Label(pile.element(i), i, "lc", 10, 3);
    pile.opacity(0).startAnimate().opacity(1).endAnimate();
    firstBucket = pile;
}

async function onUpdateBucket(arr, j) {
    await sd.pause();
    const current = arr.element(j);
    const value = arr.intValue(j);
    const bucket = firstBucket.element(value);
    const pen = new sd.PathPen(svg)
        .MoveTo(current.pos("cx", "y"))
        .LineTo(current.cx(), bucket.cy())
        .LineTo(bucket.pos("mx", "cy"));
    const link = new sd.Path(svg).d(pen.toString());
    link.startAnimate().pointStoT().endAnimate().arrow();
    await sd.pause();
    link.startAnimate().opacity(0.2).endAnimate();
}

async function onUpdateCurrent(arr, i) {
    await sd.pause();
    const current = arr.element(i);
    const value = arr.intValue(i);
    const links = [];
    firstBucket.startAnimate();
    for (let i = 1; i < value; i++) {
        firstBucket.color(i, C.blue);
        const bucket = firstBucket.element(i);
        const pen = new sd.PathPen(svg)
            .MoveTo(bucket.pos("mx", "cy"))
            .LineTo(current.cx(), bucket.cy())
            .LineTo(current.pos("cx", "y"));
        const link = new sd.Path(svg).d(pen.toString());
        link.startAnimate().pointStoT().endAnimate().arrow();
        links.push(link);
    }
    firstBucket.endAnimate();
    await sd.pause();
    links.forEach(link => {
        link.startAnimate().fadeStoT().endAnimate().remove();
    });
}
