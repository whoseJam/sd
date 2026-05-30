import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const blocks = [
    [3, 2],
    [0, 2],
    [1, 6],
    [3, 0],
];
const [sx, sy] = [0, 0];
const [ex, ey] = [7, 2];
const coord = new sd.FixGapCoord(svg).ticks("x", [-1, 7, 1]).ticks("y", [-1, 6, 1]);

sd.init(() => {
    blocks.forEach(block => {
        const block_ = new sd.Rect(svg).scale(0.2).center(coord.global(block));
        block_.color(C.grey);
    });
    new sd.Circle(svg).r(5).color(C.green).center(coord.global(sx, sy));
    new sd.Circle(svg).r(5).color(C.green).center(coord.global(ex, ey));
});

sd.main(async () => {});
