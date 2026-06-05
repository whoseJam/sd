import * as sd from "@/sd";
import { LightArray } from "./LightArray";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const lights = [1, 2, 4, 5, 6, 8, 10];
const circles = new LightArray(svg, lights);
const l = 2;
const r = 5;
const gap = 5;

sd.init(() => {
    sd.Brace(circles).brace(l, r, "t").value("已关闭");
    sd.Pointer(circles, "l", "t", 3, 20).moveTo(l);
    sd.Pointer(circles, "r", "t", 3, 20).moveTo(r);
    for (let i = l; i <= r; i++) circles.element(i).color(C.grey);
});

sd.main(async () => {
    await trans(l, l - 1, "$d_{l}-d_{l-1}$");
    await trans(l, r + 1, "$d_{r+1}-d_{l}$");
    await trans(r, l - 1, "$d_r-d_{l-1}$");
    await trans(r, r + 1, "$d_{r+1}-d_{r}$");
});

async function trans(s, t, label) {
    const es = circles.element(s);
    const et = circles.element(t);
    await sd.pause();
    es.startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
    await sd.pause();
    const line = await move(s, t, label);
    await sd.pause();
    et.startAnimate().color(C.grey).endAnimate();
    await sd.pause();
    es.startAnimate().stroke(C.black).strokeWidth(1).endAnimate();
    et.startAnimate().stroke(C.red).strokeWidth(3).endAnimate();
    await sd.pause();
    et.startAnimate().color(C.yellow).stroke(C.black).strokeWidth(1).endAnimate();
    line.startAnimate().opacity(0).endAnimate().remove();
}

async function move(s, t, label) {
    const es = circles.element(s);
    const et = circles.element(t);
    return new sd.Line(svg)
        .source(es.cx(), es.my() + gap)
        .target(et.cx(), et.my() + gap)
        .startAnimate()
        .pointStoT()
        .value(new sd.Math(svg, label).fontSize(10), R.pointAtPathByRate(0.5, "cx", "y", 0, 5))
        .endAnimate()
        .arrow();
}
