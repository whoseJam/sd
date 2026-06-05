import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const full = new sd.Vertex(svg).r(100).value("状态空间", R.center());

sd.init(() => {
    full.color(C.blue);
});

sd.main(async () => {
    await sd.pause();
    const space = full.drop();
    space.startAnimate().dy(-60).endAnimate();
    full.startAnimate().color(C.grey).endAnimate();
    new sd.Vertex(svg)
        .r(60)
        .value("有效空间", R.center())
        .color(C.blue)
        .cx(space.cx())
        .cy(full.cy() + 30)
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
});
