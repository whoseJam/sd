import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const m = 7;
const n = 10;
const coord = new sd.FixGapCoord(svg).ticks("y", 7);
const grid = sd.make2d(n + 1, m + 1);
const data = [
    [1, 1],
    [2, 5],
    [2, 4],
];

sd.init(() => {
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= m; j++) {
            grid[i][j] = cross(i, j);
        }
    data.forEach(item => {
        const [x, y] = item;
        const rect = grid[x][y].clickable(false);
        const circle = createCircle(x, y);
        circle.onClick(() => {
            sd.inter(async () => {
                circle.startAnimate().opacity(0).endAnimate().remove();
                rect.clickable(true);
            });
        });
    });
});

sd.main(async () => {});

function createCircle(x, y) {
    return coord.drawCircle(x, y, 5).after(0).color(C.black);
}

function cross(x, y) {
    const r = new sd.Rect(svg).width(10).height(10);
    const a = new sd.Line(svg).source(0, 0).target(10, 0);
    const b = new sd.Line(svg).source(0, 0).target(0, 10);
    r.childAs(a, R.center());
    r.childAs(b, R.center());
    r.fillOpacity(0);
    r.strokeOpacity(0);
    a.opacity(0.5);
    b.opacity(0.5);
    r.onClick(onClickCross.bind(r, x, y));
    r.center(coord.global(x, y));
    return r;
}

function onClickCross(x, y) {
    this.clickable(false);
    sd.inter(async () => {
        coord.startAnimate();
        const circle = createCircle(x, y);
        coord.endAnimate();
        circle.onClick(() => {
            sd.inter(async () => {
                circle.startAnimate().opacity(0).endAnimate().remove();
                this.clickable(true);
            });
        });
    });
}
