import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const axis = new sd.FixGapAxis(svg).ticks([-3, 12, 1]).withTickLabel(true).fontSize(15);
const segments = [
    [0, 5],
    [6, 11],
    [-2, 3],
];

sd.init(() => {});

sd.main(async () => {
    for (const segment of segments) {
        await sd.pause();
        const [x, y] = segment;
        const vx = new sd.Vertex(svg, "x").r(6).center(axis.tick(x).pos("cx", "cy")).opacity(0).startAnimate().opacity(1).endAnimate();
        const vy = new sd.Vertex(svg, "y").r(6).center(axis.tick(y).pos("cx", "cy")).opacity(0).startAnimate().opacity(1).endAnimate();
        await sd.pause();
        const link = sd.Link(vx, vy).stroke(C.textBlue).startAnimate().pointStoT().endAnimate().arrow();
        const brace = sd.Brace(link).brace(link, link, "t").startAnimate().pointStoT().value("$dis(x\\rightarrow y)=5$").endAnimate();
        brace.value().after(0).fontSize(12);
        await sd.pause();
        vx.startAnimate().opacity(0).endAnimate().remove();
        vy.startAnimate().opacity(0).endAnimate().remove();
    }
});
