import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const bar = new sd.BarArray(svg).pushArray("21437568");
const p1 = [0, 2, 4];
const p2 = [1, 3, 5, 6, 7];

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    drawPath(p1, C.red);
    drawPath(p2, C.textBlue);
});

function drawPath(ids, color) {
    function top(element) {
        return element.pos("cx", "y");
    }
    const pen = new sd.PathPen();
    pen.MoveTo(top(bar.element(ids[0])));
    for (let i = 1; i < ids.length; i++) pen.LineTo(top(bar.element(ids[i])));
    const path = new sd.Path(svg).d(pen.toString());
    path.strokeWidth(2).stroke(color).startAnimate().pointStoT().endAnimate().arrow();
}
