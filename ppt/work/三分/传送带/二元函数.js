import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const lAB = new sd.Line(svg).source([0, 0]).target([20, 100]);
const lCD = new sd.Line(svg).source([100, 0]).target([140, 100]);

const path = new sd.Path(svg);

const slider1 = new sd.Slider(svg).min(0).max(10).value(3);
const slider2 = new sd.Slider(svg).min(0).max(10).value(7);

slider1.onChange(() => {
    sd.inter(update);
});

slider2.onChange(() => {
    sd.inter(update);
});

sd.init(() => {
    lAB.childAs(new sd.Text(lAB, "A"), R.pointAtPathByRate(0, "cx", "my"));
    lAB.childAs(new sd.Text(lAB, "B"), R.pointAtPathByRate(1, "cx", "y"));
    lCD.childAs(new sd.Text(lCD, "C"), R.pointAtPathByRate(0, "cx", "my"));
    lCD.childAs(new sd.Text(lCD, "D"), R.pointAtPathByRate(1, "cx", "y"));
    slider1.mx(0).cy(33);
    slider2.mx(0).cy(66);
    sd.Label(slider1, "e");
    sd.Label(slider2, "f");
});

sd.main(async () => {
    await update(true);
});

async function update(first = false) {
    const p1 = lAB.source();
    const p2 = lAB.at(slider1.value() / slider1.max());
    const p3 = lCD.at(slider2.value() / slider2.max());
    const p4 = lCD.target();
    if (!first)
        path.startAnimate().d(new sd.PathPen().MoveTo(p1).LineTo(p2).LineTo(p3).LineTo(p4).toString()).endAnimate();
    else path.d(new sd.PathPen().MoveTo(p1).LineTo(p2).LineTo(p3).LineTo(p4).toString()).stroke(C.red).strokeWidth(3);
}
