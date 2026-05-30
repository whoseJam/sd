import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 7;
const grid = new sd.Grid(svg).n(n).m(n).startN(1).startM(1);
const qrid = new sd.Grid(svg).n(n).m(n).startN(1).startM(1);
const center = [4, 4]; // [0, 0] -> [4, 4] [0, 1] -> [3, 4] [1, 0] -> [4, 5]
const k = 2;

function dist(a, b) {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

sd.init(() => {
    qrid.x(grid.mx() + 100);
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if (dist(center, [i, j]) <= k) {
                grid.color(i, j, C.red);
            }
        }
    }
});

sd.main(async () => {
    await sd.pause();
    drawShape(
        // format
        grid.element(center[0], center[1] - k),
        grid.element(center[0] + k, center[1]),
        grid.element(center[0], center[1] + k),
        grid.element(center[0] - k, center[1])
    );
    await sd.pause();
    qrid.startAnimate();
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if (grid.color(i, j).fill !== C.red) continue;
            const c1 = gridToWorld([i, j]);
            const c2 = [c1[0] + c1[1], -c1[0] + c1[1]];
            const p2 = worldToGrid(c2);
            if (1 <= p2[0] && p2[0] <= n && 1 <= p2[1] && p2[1] <= n) {
                qrid.color(p2[0], p2[1], C.red);
                const line = new sd.Line(svg);
                line.source(grid.element(i, j).center());
                line.target(qrid.element(p2[0], p2[1]).center());
                line.startAnimate().pointStoT().endAnimate().arrow().startAnimate().fadeStoT().endAnimate().remove();
            }
        }
    }
    qrid.endAnimate();
});

function drawShape(a, b, c, d) {
    const pen = new sd.PathPen();
    const path = new sd.Path(svg);
    pen.MoveTo(a.center()).LineTo(b.center()).LineTo(c.center()).LineTo(d.center()).LineTo(a.center());
    path.d(pen.toString()).startAnimate(1200).pointStoT().endAnimate();
}
// grid.x = 4 - world.y
// world.y = 4 - grid.x
// grid.y = 4 + world.x
// world.x = grid.y - 4
function worldToGrid(a) {
    return [4 - a[1], 4 + a[0]];
}

function gridToWorld(a) {
    return [a[1] - 4, 4 - a[0]];
}
