import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const axis = new sd.FixGapAxis(svg).ticks(20);
const at = 8;

sd.Label(axis, "maxLength", "lc");

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    new sd.BraceCurve(svg)
        .source(axis.global(0))
        .target(axis.global(at))
        .dy(-1 * 3)
        .strokeWidth(2)
        .stroke(C.grey)
        .startAnimate()
        .pointStoT()
        .value("不能选出虫洞", R.pointAtPathByRate(0.5, "cx", "my"))
        .endAnimate();
    new sd.BraceCurve(svg)
        .source(axis.global(at + 1))
        .target(axis.global(20))
        .dy(-1 * 3)
        .strokeWidth(2)
        .stroke(C.green)
        .startAnimate()
        .pointStoT()
        .value("能选出虫洞", R.pointAtPathByRate(0.5, "cx", "my"))
        .endAnimate();
});
