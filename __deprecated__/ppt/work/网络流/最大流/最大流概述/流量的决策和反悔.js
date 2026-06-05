import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const v1 = new sd.Vertex(svg, "B").cx(100).cy(100);
const v2 = new sd.Vertex(svg, "E").cx(300).cy(100);
const lineO = sd.Link(v1, v2);
const lineI = sd.Link(v1, v2);

sd.init(() => {
    lineO.strokeWidth(10).stroke(C.grey);
    lineI.strokeWidth(5).stroke(C.red);
    const L = lineI.totalLength();
    lineI.strokeDashArray([L, L]);
    lineI.strokeDashOffset(L);
});

sd.main(async () => {
    const piece = lineI.totalLength() / 4;
    await sd.pause();
    lineI
        .startAnimate()
        .strokeDashOffset(piece * 1)
        .endAnimate();
    await sd.pause();
    lineI
        .startAnimate()
        .strokeDashOffset(piece * 2)
        .endAnimate();
});
