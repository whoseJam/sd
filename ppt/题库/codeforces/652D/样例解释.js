import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const [X, Y] = [15, 5];
const [x, y] = [3, 3];
const rect = new sd.Rect(svg).fillOpacity(0.5).strokeOpacity(0).opacity(0).color(C.red);
const coord = new sd.FixGapCoord(svg).ticks("x", X).ticks("y", Y);
coord.axis("x").withTickLabel(false);
coord.axis("y").withTickLabel(false);
sd.Label(coord.axis("x"), "l轴", "rc", 15);
sd.Label(coord.axis("y"), "r轴", "tc", 15);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    const circle = new sd.Circle(svg).r(3).center(coord.global(x, y)).color(C.orange);
    sd.Label(circle, "$(l_i,r_i)$", "tc", 15);
    circle.opacity(0).startAnimate().opacity(1).endAnimate();
    await sd.pause();
    rect.x(coord.globalX(x))
        .width(0)
        .y(coord.globalY(Y))
        .height(coord.globalY(0) - coord.globalY(Y))
        .opacity(1)
        .startAnimate()
        .width(coord.globalX(X) - coord.globalX(x))
        .endAnimate();
    await sd.pause();
    rect.startAnimate()
        .y(coord.globalY(y))
        .height(coord.globalY(0) - coord.globalY(y))
        .endAnimate();
});
