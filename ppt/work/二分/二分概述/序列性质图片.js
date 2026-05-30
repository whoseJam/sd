import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const axis = new sd.FixGapAxis(svg).ticks(20);
const at = 12;

sd.Label(axis, "序列", "lc");

sd.init(() => {
    new sd.BraceCurve(svg)
        .source(axis.global(0))
        .target(axis.global(at))
        .dy(-1 * 3)
        .strokeWidth(2)
        .stroke(C.red)
        .value(new sd.Text(svg, "性质A"), R.pointAtPathByRate(0.5, "cx", "my"));
    new sd.BraceCurve(svg)
        .source(axis.global(at + 1))
        .target(axis.global(20))
        .dy(-1 * 3)
        .strokeWidth(2)
        .stroke(C.green)
        .value(new sd.Text(svg, "性质B"), R.pointAtPathByRate(0.5, "cx", "my"));
});

sd.main(async () => {});
