import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 7;
const m = 7;
const layer = svg.append("g");
const coord = new sd.Coord(svg).width(n * 50).height(m * 50);
coord.axis("x").ticks(n);
coord.axis("y").ticks(m);

sd.init(() => {
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= m; j++) {
            const circle = coord.drawCircle(i, j, 5);
            const _i = i;
            const _j = j;
            circle.onClick(() => {
                sd.inter(async () => {
                    const line = new sd.Line(layer).stroke(C.red).strokeWidth(2);
                    line.source(coord.global(0, 0));
                    line.target(coord.global(_i, _j));
                    line.startAnimate().pointStoT().endAnimate();
                    await sd.pause();
                    line.startAnimate().fadeStoT().endAnimate();
                });
            });
        }
});

sd.main(async () => {});
