import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const m = 3;
const layer = svg.append("g");
const coord = new sd.Coord(svg).width(n * 50).height(m * 50);
const targetI = 4;
const targetJ = 2;
let targetLine;
coord.axis("x").ticks(n);
coord.axis("y").ticks(m);

sd.main(async () => {
    await sd.pause();
    coord.startAnimate();
    for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) coord.drawCircle(i, j, 5);
    coord.endAnimate();
    await sd.pause();
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= m; j++) {
            const start = coord.global(0, 0);
            const end = coord.global(i, j);
            const line = new sd.Line(layer).source(start).target(end).startAnimate().pointStoT().endAnimate();
            if (i === targetI && j == targetJ) targetLine = line;
        }
    await sd.pause();
    targetLine.startAnimate().stroke(C.red).strokeWidth(2).endAnimate();
});

function updateLine(x, y) {
    line.source(getPoint(0, 0)).target(getPoint(x, y));
}

function getPoint(i, j) {
    const e = grid.element(Math.max(n - i - 1, 0), Math.min(j, m - 1));
    const x = j === m ? e.mx() : e.x();
    const y = i === n ? e.y() : e.my();
    return [x, y];
}
