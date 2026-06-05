import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const V = sd.vec();
const coord = new sd.FixGapCoord(svg).ticks("y", 7).ticks("x", 9);
const vectors = [
    [4, 2],
    [2, 1],
    [6, 3],
    [8, 4],
];

sd.init(() => {
    vectors.forEach(vector => {
        vector.shape = new sd.Line(coord).source(coord.global(0, 0)).target(coord.global(vector)).arrow();
    });
});

sd.main(async () => {
    await sd.pause();
    vectors[0].shape.startAnimate().color(C.red).strokeWidth(3).endAnimate();
});
