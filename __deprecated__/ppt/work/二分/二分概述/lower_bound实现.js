import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const axis = new sd.FixGapAxis(svg).ticks(20);
const LLIM = 0;
const RLIM = 20;
const at = sd.rand(LLIM + 5, RLIM - 5);

sd.Label(axis, "序列", "lc");

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    new sd.BraceCurve(svg)
        .source(axis.global(0))
        .target(axis.global(at))
        .dy(-1 * 3)
        .strokeWidth(2)
        .stroke(C.red)
        .startAnimate()
        .pointStoT()
        .value(new sd.Math(svg, "a_i\\lt x"), R.pointAtPathByRate(0.5, "cx", "my"))
        .endAnimate();
    new sd.BraceCurve(svg)
        .source(axis.global(at + 1))
        .target(axis.global(20))
        .dy(-1 * 3)
        .strokeWidth(2)
        .stroke(C.green)
        .startAnimate()
        .pointStoT()
        .value(new sd.Math(svg, "a_i\\ge x"), R.pointAtPathByRate(0.5, "cx", "my"))
        .endAnimate();
    await sd.pause();
    const l = sd.Pointer(svg, "l", "t");
    const r = sd.Pointer(svg, "r", "t");
    const mid = sd.Pointer(svg, "mid", "b", 3, 50);
    l.startAnimate().moveTo(axis.tick(LLIM)).endAnimate();
    r.startAnimate().moveTo(axis.tick(RLIM)).endAnimate();

    let currentL = LLIM;
    let currentR = RLIM;
    while (currentL <= currentR) {
        const currentMid = (currentL + currentR) >> 1;
        await sd.pause();
        mid.startAnimate().moveTo(axis.tick(currentMid)).endAnimate();
        await sd.pause();
        if (currentMid <= at) {
            r.startAnimate();
            l.startAnimate()
                .moveTo(axis.tick((currentL = currentMid + 1)))
                .endAnimate();
            r.endAnimate();
        } else {
            l.startAnimate();
            r.startAnimate()
                .moveTo(axis.tick((currentR = currentMid - 1)))
                .endAnimate();
            l.endAnimate();
        }
        await sd.pause();
        mid.startAnimate().moveTo(null).endAnimate();
    }
});
