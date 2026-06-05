import * as sd from "@/sd";
import { bucketOptimize } from "../_/BucketOptimize";

const svg = sd.svg();
const C = sd.color();
const charset = "cba";
const str = "accbabbaac";
const arr = new sd.Array(svg).x(100).y(200).start(1);
let firstBucket;

sd.init(() => {
    arr.pushArray(str);
});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(arr, "i", "t").startAnimate().moveTo(str.length).endAnimate();
    await sd.pause();
    const pj = sd.Pointer(arr, "j", "t");
    for (let i = 1; i < arr.length(); i++) {
        arr.startAnimate();
        pj.moveTo(i);
        arr.color(i, arr.text(i) !== "b" ? C.green : C.red);
        arr.endAnimate();
    }
    await sd.pause();
    pj.startAnimate().moveTo(null).endAnimate();
    await sd.pause();
    await bucketOptimize(arr, str.length, {
        onCreateFirstBucket,
        onUpdateBucket,
        onUpdateCurrent,
    });
});

async function onCreateFirstBucket(arr, cx) {
    const stk = new sd.Stack(svg).elementWidth(15).elementHeight(15).resize(charset.length);
    stk.cx(cx).my(arr.y() - 5);
    for (let i = 0; i < charset.length; i++) {
        const lb = sd.Label(stk.element(i), charset[i], "lc", 10, 3);
    }
    stk.opacity(0).startAnimate().opacity(1).endAnimate();
    firstBucket = stk;
}

async function onUpdateBucket(arr, j) {
    await sd.pause();
    const current = arr.element(j);
    const bucket = firstBucket.element(charIndex(arr.text(j)));
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
    const links = [];
    firstBucket.startAnimate();
    for (let i = 0; i < charset.length; i++) {
        if (i === 1) continue;
        firstBucket.color(i, C.blue);
        const pen = new sd.PathPen(svg)
            .MoveTo(firstBucket.element(i).pos("mx", "cy"))
            .LineTo(current.cx(), firstBucket.element(i).cy())
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

function charIndex(a) {
    if (a === "a") return 2;
    if (a === "b") return 1;
    return 0;
}
