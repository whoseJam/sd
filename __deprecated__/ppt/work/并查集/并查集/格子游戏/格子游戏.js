import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 4;
const m = 6;
const grid = new sd.Grid(svg).n(n).m(m);
const circles = sd.make2d(n + 1, m + 1);
const links = [
    [1, 2, 1, 3],
    [3, 4, 2, 4],
    [2, 2, 3, 2],
    [2, 4, 2, 3],
    [1, 3, 2, 3],
    [3, 3, 3, 4],
    [1, 2, 2, 2],
    [3, 2, 3, 3],
];

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= m; j++) {
            const circle = new sd.Circle(svg).r(3).color(C.orange);
            circle.cx(grid.x() + grid.elementWidth() * j);
            circle.cy(grid.y() + grid.elementHeight() * i);
            circle.opacity(0).startAnimate().opacity(1).endAnimate();
            circles[i][j] = circle;
        }
    }
    for (let i = 0; i < links.length; i++) {
        await sd.pause();
        const [a, b, x, y] = links[i];
        sd.Link(circles[a][b], circles[x][y]).stroke(C.red).strokeWidth(3).startAnimate().pointStoT().endAnimate();
    }
});
