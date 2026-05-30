import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const layer = svg.append("g");
const [X, Y] = [15, 6];
const coord = new sd.FixGapCoord(svg).ticks("x", X).ticks("y", Y);
const [x, y] = [11, 3];
const data = [
    [1, 2],
    [4, 5],
    [3, 1],
    [7, 2],
    [9, 6],
];
coord.axis("x").withTickLabel(false);
coord.axis("y").withTickLabel(false);
sd.Label(coord.axis("x"), "v轴", "rc");
sd.Label(coord.axis("y"), "x轴", "tc");

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    const circle = coord.drawCircle(x, y).r(4).color(C.orange);
    sd.Label(circle, "$(v_i,x_i)$", "tc", 15);
    circle.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    const rect = new sd.Rect(layer).fillOpacity(0.5).fill(C.red).strokeOpacity(0);
    rect.x(coord.globalX(x)).width(0).height(coord.height());
    rect.startAnimate()
        .x(0)
        .width(coord.globalX(x) - coord.globalX(0))
        .endAnimate();
    await sd.pause();
    data.forEach(([x, y]) => {
        const circle = coord.drawCircle(x, y).r(4).color(C.orange);
        circle.opacity(0).startAnimate().opacity(1).endAnimate();
    });
    await sd.pause();
    new sd.Line(svg)
        .source(coord.globalX(x) - 4, coord.globalY(y))
        .target(coord.global(0, y))
        .startAnimate()
        .pointStoT()
        .endAnimate();
    data.forEach(([x_, y_]) => {
        const at = coord.global(x_, y_);
        const dy = y_ > y ? 4 : -4;
        new sd.Line(svg)
            .source(at[0], at[1] + dy)
            .target(coord.global(x_, y))
            .startAnimate()
            .pointStoT()
            .endAnimate();
    });
    await sd.pause();
    rect.startAnimate()
        .height(coord.globalY(y) - coord.globalY(Y))
        .endAnimate();
    await sd.pause();
    rect.startAnimate()
        .y(coord.globalY(y))
        .height(coord.globalY(0) - coord.globalY(y))
        .endAnimate();
});
