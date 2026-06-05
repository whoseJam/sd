import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const n = 8;
const objects = new sd.ValueArray(svg).start(1).elementWidth(80);
const hs = new sd.ValueArray(svg).dy(100).start(1).elementWidth(80);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        objects.push(`$o_${i}$`);
    }
});

sd.main(async () => {
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        for (let j = i + 1; j <= n; j++) {
            sd.Link(objects.element(i), objects.element(j), sd.Curve).opacity(0.2).bending(-0.15).startAnimate().pointStoT().endAnimate();
        }
    }
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        hs.push(`$h_${i}$`);
        sd.Link(objects.element(i), hs.element(i), sd.Line).startAnimate().pointStoT().value("f", R.pointAtPathByRate(0.5, "x", "cy", 3)).endAnimate().arrow();
    }
    await sd.pause();
    for (let i = 1; i <= n; i++) {
        for (let j = i + 1; j <= n; j++) {
            sd.Link(hs.element(i), hs.element(j), sd.Curve).opacity(0.2).bending(0.15).startAnimate().pointStoT().endAnimate();
        }
    }
});
