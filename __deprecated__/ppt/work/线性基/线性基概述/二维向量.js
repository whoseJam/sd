import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const coord = new sd.FixGapCoord(svg).ticks("x", 5).ticks("y", 5);

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    coord.startAnimate();
    const dot = coord.drawCircle(3, 4, 3).after(0).color(C.black);
    sd.Label(dot, "$(3, 4)$");
    coord.endAnimate();
    await sd.pause();
    new sd.Line(coord).source(coord.global(0, 0)).target(coord.global(3, 4)).startAnimate().pointStoT().endAnimate().arrow();
});
