import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const line = new sd.Line(svg).source(0, 0).target(500, 0);
const positions = [100, 150, 250, 280, 320, 450];
const start = 200;
const circles = [];

sd.init(() => {
    positions.forEach(pos => {
        circles.push(new sd.Circle(svg).r(6).center([pos, 0]));
    });
    new sd.Circle(svg).r(6).center([start, 0]).color(C.red);
})

sd.main(async () => {
    let p = 0;
    for (; p < positions.length; p++)
        if (positions[p] >= start) break;
    
    const a1 = sd.rand(0, p - 1);
    const b1 = sd.rand(p, positions.length - 1);
    await Path(a1, b1);
    const a2 = sd.rand(p, positions.length - 1);
    const b2 = sd.rand(0, p - 1);
    await Path(a2, b2);
})

async function Path(a, b) {
    await sd.pause();
    const l1 = LinkTo(start, positions[a], 10).startAnimate().pointStoT().endAnimate().arrow();
    const l2 = LinkTo(positions[a], positions[b], -10).opacity(0).after(300).opacity(1).startAnimate().pointStoT().endAnimate().arrow();
    await sd.pause();
    l1.startAnimate().opacity(0).endAnimate();
    l2.startAnimate().opacity(0).endAnimate();
}

function LinkTo(x1, x2, dy) {
    const line = new sd.Line(svg).source(x1, dy).target(x2, dy);
    return line;
}