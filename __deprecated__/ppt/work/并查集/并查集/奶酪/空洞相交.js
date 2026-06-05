import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();

const centerX = 500;
const centerY = 300;
const R = 40;

const circle1 = new sd.Circle(svg)
    .r(0)
    .color(C.BLUE)
    .fillOpacity(0.3)
    .cx(centerX - 100)
    .cy(centerY);
const circle2 = new sd.Circle(svg)
    .r(0)
    .color(C.GREEN)
    .fillOpacity(0.3)
    .cx(centerX + 100)
    .cy(centerY);

const line = new sd.Line(svg)
    .source(centerX - 100, centerY)
    .target(centerX + 100, centerY)
    .strokeWidth(2)
    .stroke(C.grey)
    .opacity(0);

const distMath = new sd.Math(svg, "d")
    .cx(centerX)
    .cy(centerY - 50)
    .fontSize(20)
    .opacity(0);

const radiusLine1 = new sd.Line(svg)
    .source(centerX - 100, centerY)
    .target(centerX - 100, centerY - R)
    .stroke(C.blue)
    .strokeWidth(2)
    .opacity(0);
const radiusLine2 = new sd.Line(svg)
    .source(centerX + 100, centerY)
    .target(centerX + 100, centerY - R)
    .stroke(C.green)
    .strokeWidth(2)
    .opacity(0);

const radiusMath1 = new sd.Math(svg, "r")
    .cx(centerX - 85)
    .cy(centerY - R / 2)
    .fontSize(18)
    .fill(C.blue)
    .opacity(0);
const radiusMath2 = new sd.Math(svg, "r")
    .cx(centerX + 115)
    .cy(centerY - R / 2)
    .fontSize(18)
    .fill(C.green)
    .opacity(0);

const formula = new sd.Math(svg, "")
    .cx(centerX)
    .cy(centerY + 100)
    .fontSize(28)
    .opacity(0);

sd.init(() => {
    circle1.r(R);
    circle2.r(R);
});

sd.main(async () => {
    await sd.pause();

    line.startAnimate().opacity(1).endAnimate();
    distMath.startAnimate().opacity(1).endAnimate();
    await sd.pause();

    radiusLine1.startAnimate().opacity(1).endAnimate();
    radiusMath1.startAnimate().opacity(1).endAnimate();
    radiusLine2.startAnimate().opacity(1).endAnimate();
    radiusMath2.startAnimate().opacity(1).endAnimate();
    await sd.pause();
    formula.startAnimate().text("d = 2r").cx(centerX).endAnimate();
    await sd.pause();
    const dist2 = 2 * R;
    circle1
        .startAnimate()
        .cx(centerX - dist2 / 2)
        .endAnimate();
    circle2
        .startAnimate()
        .cx(centerX + dist2 / 2)
        .endAnimate();
    line.startAnimate()
        .source(centerX - dist2 / 2, centerY)
        .target(centerX + dist2 / 2, centerY)
        .endAnimate();
    radiusLine1
        .startAnimate()
        .source(centerX - dist2 / 2, centerY)
        .target(centerX - dist2 / 2, centerY - R)
        .endAnimate();
    radiusLine2
        .startAnimate()
        .source(centerX + dist2 / 2, centerY)
        .target(centerX + dist2 / 2, centerY - R)
        .endAnimate();
    radiusMath1
        .startAnimate()
        .cx(centerX - dist2 / 2 - 15)
        .endAnimate();
    radiusMath2
        .startAnimate()
        .cx(centerX + dist2 / 2 + 15)
        .endAnimate();
    formula.startAnimate().text("d = 2r").cx(centerX).endAnimate();
    await sd.pause();
    const dist3 = 1.2 * R;
    circle1
        .startAnimate()
        .cx(centerX - dist3 / 2)
        .endAnimate();
    circle2
        .startAnimate()
        .cx(centerX + dist3 / 2)
        .endAnimate();
    line.startAnimate()
        .source(centerX - dist3 / 2, centerY)
        .target(centerX + dist3 / 2, centerY)
        .endAnimate();
    radiusLine1
        .startAnimate()
        .source(centerX - dist3 / 2, centerY)
        .target(centerX - dist3 / 2, centerY - R)
        .endAnimate();
    radiusLine2
        .startAnimate()
        .source(centerX + dist3 / 2, centerY)
        .target(centerX + dist3 / 2, centerY - R)
        .endAnimate();
    radiusMath1
        .startAnimate()
        .cx(centerX - dist3 / 2 - 15)
        .endAnimate();
    radiusMath2
        .startAnimate()
        .cx(centerX + dist3 / 2 + 15)
        .endAnimate();
    formula.startAnimate().text("d < 2r").cx(centerX).endAnimate();
});
