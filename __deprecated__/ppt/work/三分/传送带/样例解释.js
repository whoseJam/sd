import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const lAB = new sd.Line(svg).source([0, 0]).target([20, 100]);
const lCD = new sd.Line(svg).source([100, 0]).target([140, 100]);

sd.init(() => {
    lAB.childAs(new sd.Text(lAB, "A"), R.pointAtPathByRate(0, "cx", "my"));
    lAB.childAs(new sd.Text(lAB, "B"), R.pointAtPathByRate(1, "cx", "y"));
    lCD.childAs(new sd.Text(lCD, "C"), R.pointAtPathByRate(0, "cx", "my"));
    lCD.childAs(new sd.Text(lCD, "D"), R.pointAtPathByRate(1, "cx", "y"));
});

sd.main(async () => {
    await sd.pause();
    const p1 = lAB.source();
    const p2 = lAB.at(0.3);
    const p3 = lCD.at(0.7);
    const p4 = lCD.target();
    const path = new sd.Path(svg)
        .d(new sd.PathPen().MoveTo(p1).LineTo(p2).LineTo(p3).LineTo(p4).toString())
        .stroke(C.red)
        .strokeWidth(3)
        .startAnimate(1000)
        .pointStoT()
        .endAnimate();
});
