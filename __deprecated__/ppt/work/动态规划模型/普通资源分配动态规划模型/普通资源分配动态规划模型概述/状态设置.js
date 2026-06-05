import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const r = new sd.Rect(svg).width(80).height(100).color(C.BLUE);
const b = new sd.BraceCurve(r);
let percent = 1.0;

sd.init(() => {
    update();
    r.childAs(new sd.Text(r, "资源"), R.center());
});

sd.main(async () => {
    await sd.pause();
    b.startAnimate().value("i", R.pointAtPathByRate(0.5, "mx", "cy")).endAnimate();
    await sd.pause();
    percent = 0.8;
    b.startAnimate();
    update();
    b.endAnimate();
    await sd.pause();
    percent = 0.6;
    b.startAnimate();
    update();
    b.endAnimate();
    await sd.pause();
    percent = 0.4;
    b.startAnimate();
    update();
    b.endAnimate();
    await sd.pause();
    percent = 0.2;
    b.startAnimate();
    update();
    b.endAnimate();
});

function update() {
    const dy = r.height() * percent;
    b.target([r.x() - 3, r.my() - dy]);
    b.source(r.pos("x", "my", -3, 0));
}
