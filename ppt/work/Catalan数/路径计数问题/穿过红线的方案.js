import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const D = sd.device();
const V = sd.vec();
const n = 5;
const upper = new sd.Grid(svg).n(1).m(n - 1);
const grid = new sd.Grid(svg).n(n).m(n);

const p2 = { x: 0, y: 0, pen: new sd.PathPen(), path: new sd.Path(svg).stroke(C.green).strokeWidth(2) };
const p1 = { x: 0, y: 0, pen: new sd.PathPen(), path: new sd.Path(svg).stroke(C.textBlue).strokeWidth(2) };
let crossRed = false;
Init(p1, 0, 0);
Init(p2, 0, 0);

D.onKeyDown("w", () => {
    if (p1.y === n) return;
    sd.inter(async () => {
        MoveUp(p1);
        if (crossRed) MoveRight(p2);
        else MoveUp(p2);
        if (p1.x + 1 === p1.y) crossRed = true;
        if (p2.y === n + 1) upper.startAnimate().opacity(1).endAnimate();
    });
});
D.onKeyDown("d", () => {
    if (p1.x === n) return;
    sd.inter(async () => {
        MoveRight(p1);
        if (crossRed) MoveUp(p2);
        else MoveRight(p2);
        if (p2.y === n + 1) upper.startAnimate().opacity(1).endAnimate();
    });
});

sd.init(() => {
    const line = new sd.Line(svg);
    line.source(V.add(grid.pos("x", "my"), [-20, 20]));
    line.target(V.add(grid.pos("mx", "y"), [20, -20]));
    line.stroke(C.red).strokeWidth(2);
    upper.my(grid.y()).opacity(0);
});

sd.main(async () => {});

function Init(p, dx, dy) {
    p.pen.MoveTo(V.add(grid.pos("x", "my"), [dx, dy]));
    p.path.d(p.pen.toString());
}

function MoveRight(p) {
    p.x++;
    p.pen.lineTo([40, 0]);
    p.path.startAnimate().d(p.pen.toString()).endAnimate();
}

function MoveUp(p) {
    p.y++;
    p.pen.lineTo([0, -40]);
    p.path.startAnimate().d(p.pen.toString()).endAnimate();
}
