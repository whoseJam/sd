import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const V = sd.vec();
const EN = sd.enter();
const L = 100;
const l1 = new sd.Line(svg).source(100, 100).target(700, 100);
const l2 = new sd.Line(svg).source(100, 140).target(700, 140);
const rs = new sd.Rect(svg).width(300).color(C.blue).x(200).y(100);
const rt = new sd.Rect(svg).width(300).color(C.blue).x(200).y(180);

sd.init(() => {
    new sd.Math(svg, "s").cy(120).x(100);
    new sd.Math(svg, "t").cy(200).x(100);
    const pointer = sd.Pointer(rt, "j", "t", 3, 20).opacity(1);
    rt.childAs(pointer, function (parent, child) {
        child.source(V.add(parent.pos("mx", "my"), [-20, 23]));
        child.target(V.add(parent.pos("mx", "my"), [-20, 3]));
    });
});

sd.main(async () => {
    await sd.pause();
    rs.startAnimate().childAs("rct", new sd.Rect(svg).color(C.red).onEnter(EN.appear()), R.aside("rc", 0)).endAnimate();
    rt.startAnimate().childAs("rct", new sd.Rect(svg).color(C.orange).onEnter(EN.appear()), R.aside("rc", 0)).endAnimate();
    sd.Pointer(rt, "j+1", "t", 3, 20, 3).startAnimate().moveTo(rt.child("rct")).endAnimate();

    await sd.pause();
    const a1 = new sd.Line(svg);
    rt.childAs(a1, function () {
        a1.source(rt.pos("x", "cy"));
        a1.target(V.add(rt.pos("x", "cy"), [L, 0]));
    });
    const a2 = new sd.Line(svg);
    rt.childAs(a2, function () {
        a2.source(V.add(rt.pos("mx", "cy"), [-L, 0]));
        a2.target(rt.pos("mx", "cy"));
    });
    a1.startAnimate().pointStoT().endAnimate().arrow();
    a2.startAnimate().pointStoT().endAnimate().arrow();

    await sd.pause();
    const a3 = new sd.Line(svg);
    a3.source(rs.pos("x", "cy"));
    a3.target(V.add(rs.pos("x", "cy"), [L, 0]));
    a3.startAnimate().pointStoT().endAnimate().arrow();
    const a4 = new sd.Line(svg);
    a4.source(V.add(rs.pos("mx", "cy"), [-L, 0]));
    a4.target(rs.pos("mx", "cy"));
    a4.startAnimate().pointStoT().endAnimate().arrow();

    await sd.pause();
    rt.startAnimate().dx(200).endAnimate();
    await sd.pause();
    new sd.Box(svg, "?")
        .opacity(0)
        .x(rt.x() + L)
        .y(rt.y())
        .startAnimate()
        .opacity(1)
        .endAnimate();

    await sd.pause();
    new sd.BraceCurve(svg).target(rt.pos("x", "my")).source(a1.mx(), rt.my()).value(new sd.Math(svg, "len_j"), R.pointAtPathByRate(0.5, "cx", "y")).opacity(0).startAnimate().opacity(1).endAnimate();
});
