import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 10;
const s = new sd.Array(svg);
const f = new sd.Array(svg).y(s.my());
const zeroIndex = [4, 6, 9];

sd.init(() => {
    sd.Label(f, "f", "lc");
    sd.Label(s, "s", "lc");
    for (let i = 0; i <= n; i++) {
        s.push().lastElement().value(new sd.Text(s, "s"), R.center());
        f.push().lastElement().value(new sd.Text(f, "f"), R.center());
    }
    sd.Index(s, "t");
});

sd.main(async () => {
    await sd.pause();
    s.element(0).value().startAnimate().text("0").endAnimate();
    f.element(0).value().startAnimate().text("1").endAnimate();
    await sd.pause();
    s.startAnimate();
    zeroIndex.forEach(idx => {
        s.text(idx, "0");
    });
    s.endAnimate();
    await sd.pause();
    s.startAnimate();
    zeroIndex.forEach(idx => {
        s.color(idx, C.green);
        f.element(idx).startAnimate().color(C.green).endAnimate();
        sd.Link(f.element(0), f.element(idx), sd.Curve, "cx", "my", "cx", "my")
            .startAnimate()
            .pointStoT()
            .endAnimate()
            .arrow();
    });
    s.endAnimate();
});
