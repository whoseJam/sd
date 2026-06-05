import * as sd from "@/sd";
import { bucketOptimize } from "../_/BucketOptimize";

const svg = sd.svg();
const C = sd.color();
const colors = [1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4];
const colorTypes = [...new Set(colors)];
const arr = new sd.Array(svg).resize(colors.length);
let firstBucket;

sd.init(() => {
    for (let i = 0; i < colors.length; i++) {
        arr.value(i, colors[i]);
    }
});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(arr, "i", "t")
        .startAnimate()
        .moveTo(colors.length - 1)
        .endAnimate();
    await sd.pause();
    const set = new Set();
    const pj = sd.Pointer(arr, "j", "t");
    for (let i = colors.length - 2; i >= 0; i--) {
        pj.startAnimate().moveTo(i).endAnimate();
        if (set.has(colors[i])) continue;
        set.add(colors[i]);
        sd.Link(arr.element(i), arr.element(colors.length - 1), sd.Curve, "cx", "my", "cx", "my")
            .opacity(0)
            .after(pj)
            .opacity(1)
            .startAnimate()
            .pointStoT()
            .endAnimate()
            .arrow();
    }
    await sd.pause();
    pj.startAnimate().moveTo(null).endAnimate();
    await sd.pause();
    await bucketOptimize(arr, colors.length - 1, {
        onCreateFirstBucket,
        onUpdateBucket,
        onUpdateCurrent,
    });
});

async function onUpdateBucket(arr, j) {
    await sd.pause();
    const current = arr.element(j);
    const id = colorTypes.indexOf(+current.text());
    const bucket = firstBucket.element(id);
    const pen = new sd.PathPen(svg)
        .MoveTo(current.pos("cx", "y"))
        .LineTo(current.cx(), bucket.cy())
        .LineTo(bucket.pos("mx", "cy"));
    const link = new sd.Path(svg).d(pen.toString());
    if (bucket.link) bucket.link.startAnimate().fadeStoT().endAnimate();
    link.startAnimate().pointStoT().endAnimate().arrow();
    bucket.link = link;
}

async function onUpdateCurrent(arr, i) {
    await sd.pause();
    firstBucket.startAnimate().color(C.blue).endAnimate();
}

async function onCreateFirstBucket(arr, cx) {
    const stk = new sd.Pile(svg).elementWidth(15).elementHeight(15).resize(colorTypes.length);
    stk.cx(cx)
        .my(arr.y() - 5)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .forEachElement((element, i) => {
            sd.Aside(element, new sd.Text(svg, colorTypes[i]).scale(0.2), "lc");
        })
        .endAnimate();
    firstBucket = stk;
}
