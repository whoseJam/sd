import * as sd from "@/sd";
import { BallCoord } from "./BallCoord";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const balls = [
    [1, 5],
    [2, 4],
    [4, 6],
    [5, 1],
    [6, 5],
    [8, 3],
    [10, 4],
];
const circles = new BallCoord(svg, balls);
const gap = 5;
const l = 2;
const r = 5;

sd.init(() => {
    const brace = sd.Brace(circles).brace(l, r, "t").value("已收集");
    console.log(circles.element(l));
    console.log(circles.element(r));
    sd.Pointer(circles, "l", "b", 3, 20).opacity(1).source(0, 0).target(0, 20).my(brace.y()).cx(circles.element(l).cx());
    sd.Pointer(circles, "r", "b", 3, 20).opacity(1).source(0, 0).target(0, 20).my(brace.y()).cx(circles.element(r).cx());
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
    et.startAnimate().color(C.cyan).stroke(C.black).strokeWidth(1).endAnimate();
    line.startAnimate().opacity(0).endAnimate().remove();
}

async function move(s, t, label) {
    const es = circles.element(s);
    const et = circles.element(t);
    const line = new sd.Line(svg);
    if (es === undefined) line.source((circles.element(s - 1).cx() + circles.element(s + 1).cx()) / 2, 50 - gap);
    else line.source(es.cx(), 50 - gap);
    line.target(et.cx(), 50 - gap)
        .startAnimate()
        .pointStoT()
        .value(new sd.Math(svg, label).fontSize(15), R.pointAtPathByRate(0.5, "cx", "my", 0, -5))
        .endAnimate()
        .arrow();
    return line;
}
