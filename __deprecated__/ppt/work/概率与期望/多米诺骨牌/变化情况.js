import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const n = 10;
const arrRoot = MakeArray();
const arrPl = MakeArray();
const arrPr = MakeArray();
const arrRes = MakeArray();
const L12 = sd.Link(arrRoot, arrPl).arrow();
const L13 = sd.Link(arrRoot, arrPr).arrow();
const L14 = sd.Link(arrRoot, arrRes).arrow();
const at = 4;
const arrs = [arrPl, arrPr, arrRes, arrRoot];
const fontSize = 10;

sd.init(() => {
    arrPl.dx(-100).dy(50).opacity(0);
    arrPr.dx(0).dy(90).opacity(0);
    arrRes.dx(100).dy(50).opacity(0);
});

sd.main(async () => {
    await sd.pause();
    arrs.forEach(arr => arr.startAnimate().color(at, C.orange).endAnimate());
    await sd.pause();
    const l = new sd.Line(svg)
        .source(arrRoot.cx(), arrRoot.y() - 50)
        .target(arrRoot.cx(), arrRoot.y())
        .arrow()
        .opacity(0)
        .value(new sd.Math(svg, "E_l+E_r").fontSize(fontSize), R.pointAtPathByRate(0.5, "x", "cy"))
        .startAnimate()
        .opacity(1)
        .endAnimate();

    await sd.pause();
    L12.startAnimate().value(new sd.Math(L12, "P_l").fontSize(fontSize).color(C.textBlue), R.pointAtPathByRate(0.5, "mx", "cy", -10)).endAnimate();
    arrPl.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    arrPl.startAnimate().color(0, at, C.grey).endAnimate();
    await sd.pause();
    L12.childAs("add", new sd.Math(L12, "+1").fontSize(fontSize), R.pointAtPathByRate(0.5, "x", "cy", 10));
    L12.child("add").opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    sd.Aside(arrPl, new sd.Math(svg, "E_i-E_r").fontSize(fontSize), "bc").opacity(0).startAnimate().opacity(1).endAnimate();

    await sd.pause();
    L13.startAnimate().value(new sd.Math(L13, "P_r").fontSize(fontSize).color(C.textBlue), R.pointAtPathByRate(0.5, "mx", "cy", -5)).endAnimate();
    arrPr.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    arrPr
        .startAnimate()
        .color(at, n - 1, C.grey)
        .endAnimate();
    await sd.pause();
    L13.childAs("add", new sd.Math(L13, "+1").fontSize(fontSize), R.pointAtPathByRate(0.5, "x", "cy", 5));
    L13.child("add").opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    sd.Aside(arrPr, new sd.Math(svg, "E_i-E_l").fontSize(fontSize), "bc").opacity(0).startAnimate().opacity(1).endAnimate();

    await sd.pause();
    L14.startAnimate().value(new sd.Math(L14, "1-P_l-P_r").fontSize(fontSize).color(C.textBlue), R.pointAtPathByRate(0.5, "x", "cy", 15)).endAnimate();
    arrRes.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    L14.childAs("add", new sd.Math(L14, "+1").fontSize(fontSize), R.pointAtPathByRate(0.5, "mx", "cy", -10));
    L14.child("add").opacity(0).startAnimate().opacity(1).endAnimate();
});

function MakeArray() {
    return new sd.Array(svg).elementWidth(10).elementHeight(10).resize(n);
}
