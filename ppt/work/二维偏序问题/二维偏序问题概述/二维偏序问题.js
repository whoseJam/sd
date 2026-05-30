import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const rect = new sd.Rect(svg).fillOpacity(0.5).fill(C.red).opacity(0).strokeOpacity(0);
const [X, Y] = [15, 6];
const coord = new sd.FixGapCoord(svg).ticks("y", Y).ticks("x", X);
const at = [8, 4];
const data = [
    [1, 2],
    [3, 1],
    [5, 3],
    [2, 1],
    [4, 6],
    [10, 5],
    [8, 4],
    [7, 6],
    [13, 1],
    [12, 3],
    [11, 2],
    [14, 6],
];

sd.init(() => {
    data.forEach(item => {
        coord.drawCircle(item[0], item[1]).r(6).color(C.orange);
    });
});

sd.main(async () => {
    await sd.pause();
    focus(0, 0, at[0], at[1]);
    await sd.pause();
    focus(0, at[1], at[0], Y);
    await sd.pause();
    focus(at[0], 0, X, at[1]);
    await sd.pause();
    focus(at[0], at[1], X, Y);
});

function focus(x1, y1, x2, y2) {
    const p1 = coord.global(x1, y2);
    const p2 = coord.global(x2, y1);
    if (rect.opacity() === 0) {
        rect.x(p1[0]).y(p1[1]);
        rect.width(p2[0] - p1[0]);
        rect.height(p2[1] - p1[1]);
        rect.startAnimate().opacity(1).endAnimate();
    } else {
        rect.startAnimate();
        rect.x(p1[0]).y(p1[1]);
        rect.width(p2[0] - p1[0]);
        rect.height(p2[1] - p1[1]);
        rect.endAnimate();
    }
}
