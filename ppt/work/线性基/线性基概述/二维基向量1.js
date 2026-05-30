import * as sd from "@/sd";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const V = sd.vec();
const coord = new sd.FixGapCoord(svg).ticks("y", 7).ticks("x", 9);
const vectors = [
    [1, 2],
    [3, 1],
    [8, 6],
    [1, 5],
    [7, 4],
];

sd.init(() => {
    vectors.forEach(vector => {
        vector.shape = new sd.Line(coord).source(coord.global(0, 0)).target(coord.global(vector)).arrow();
    });
});

sd.main(async () => {
    await sd.pause();
    vectors[0].shape.startAnimate().color(C.red).endAnimate();
    vectors[1].shape.startAnimate().color(C.red).endAnimate();
    for (let i = 2; i < vectors.length; i++) {
        await sd.pause();
        vectors[i].shape.startAnimate().color(C.textBlue).endAnimate();
        await sd.pause();
        const [l1, l2] = solve(coord, vectors[0], vectors[1], vectors[i]);
        await sd.pause();
        l1.startAnimate().fadeStoT().value(null).endAnimate().remove();
        l2.startAnimate().fadeStoT().value(null).endAnimate().remove();
        vectors[i].shape.startAnimate().color(C.black).opacity(0.5).strokeDashArray([5, 5]).endAnimate();
    }
});

// k1 * a + k2 * b = c
function solve(coord, a, b, c) {
    // k1 * a[0] + k2 * b[0] = c[0]
    // k1 * a[1] + k2 * b[1] = c[1]
    const del = a[1] / a[0];
    // k1 * (a[1] - del * a[0]) + k2 * (b[1] - del * b[0]) = c[1] - del * c[0]
    const k2 = (c[1] - del * c[0]) / (b[1] - del * b[0]);
    const k1 = (c[1] - b[1] * k2) / a[1];
    const shapeA = new sd.Line(coord)
        .source(coord.global(0, 0))
        .target(coord.global(V.numberMul(a, k1)))
        .opacity(0.5)
        .startAnimate()
        .value(k1, R.pointAtPathByRate(0.5, "mx", "my"))
        .pointStoT()
        .endAnimate()
        .arrow();
    const shapeB = new sd.Line(coord)
        .source(coord.global(V.numberMul(a, k1)))
        .target(coord.global(V.add(V.numberMul(a, k1), V.numberMul(b, k2))))
        .opacity(0)
        .after(shapeA)
        .opacity(0.5)
        .startAnimate()
        .value(k2, R.pointAtPathByRate(0.5, "mx", "my"))
        .pointStoT()
        .endAnimate()
        .arrow();
    return [shapeA, shapeB];
}
