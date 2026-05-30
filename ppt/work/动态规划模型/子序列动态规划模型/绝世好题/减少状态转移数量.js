import * as sd from "@/sd";
import { bucketOptimize } from "../_/BucketOptimize";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const EN = sd.enter();
const logV = 3;
const data = [1, 6, 2, 7, 4, 5, 6, 3, 2, 3];
const arr = new sd.Array(svg);
let firstBucket;

sd.init(() => {
    for (let i = 0; i < data.length; i++) arr.push(binaryStr(data[i]));
});

sd.main(async () => {
    await sd.pause();
    sd.Pointer(arr, "i", "t")
        .startAnimate()
        .moveTo(data.length - 1)
        .endAnimate();
    await sd.pause();
    const pj = sd.Pointer(arr, "j", "t");
    for (let i = 0; i < data.length - 1; i++) {
        arr.startAnimate();
        pj.moveTo(i);
        arr.color(i, (data[i] & data[data.length - 1]) !== 0 ? C.green : C.red);
        arr.endAnimate();
    }
    await sd.pause();
    pj.startAnimate().moveTo(null).endAnimate();
    await sd.pause();
    await bucketOptimize(arr, data.length - 1, {
        onCreateFirstBucket,
        onCreateBucket,
        onUpdateBucket,
        onUpdateCurrent,
    });
});

async function onUpdateBucket(arr, j) {
    const currentBucket = arr.element(j).child("stk");
    const links = [];
    await sd.pause();
    for (let i = 0; i < logV; i++) {
        if (currentBucket.text(i) === "1") {
            const link = sd.Link(currentBucket.element(i), firstBucket.element(i)).startAnimate().pointStoT().endAnimate().arrow();
            links.push(link);
        }
    }
    await sd.pause();
    links.forEach(link => {
        link.startAnimate().fadeStoT().endAnimate().remove();
    });
}

async function onUpdateCurrent(arr, i) {
    const currentBucket = arr.element(i).child("stk");
    const links = [];
    await sd.pause();
    for (let i = 0; i < logV; i++) {
        if (currentBucket.text(i) === "1") {
            const link = sd.Link(firstBucket.element(i), currentBucket.element(i)).startAnimate().pointStoT().endAnimate().arrow();
            links.push(link);
        }
    }
    await sd.pause();
    links.forEach(link => {
        link.startAnimate().fadeStoT().endAnimate().remove();
    });
}

async function onCreateFirstBucket(arr, cx) {
    const stk = new sd.Pile(svg).elementWidth(15).elementHeight(15).resize(logV);
    stk.cx(cx)
        .my(arr.y() - 5)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    stk.forEachElement((element, i) => {
        sd.Label(element, `bit${i}`, "lc", 10, 3);
    });
    firstBucket = stk;
}

async function onCreateBucket(arr, i) {
    const element = arr.element(i);
    const stk = new sd.Pile(svg).elementWidth(15).elementHeight(15).resize(logV);
    for (let i = 0; i < logV; i++) stk.value(logV - i - 1, element.text()[i]);
    element.startAnimate().childAs("stk", stk.onEnter(EN.appear()), R.aside("tc", 5)).endAnimate();
}

function binaryStr(x) {
    let ans = "";
    for (let i = 0; i < logV; i++) {
        ans = String(x % 2) + ans;
        x = Math.floor(x / 2);
    }
    return ans;
}
