import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const coord = new sd.Coord(svg).width(600).height(200);

sd.init(() => {
    coord.draw(1, x => x * x * x - 3 * x * x - 3 * x + 1);
    coord.viewX(-2.5).viewHeight(10).viewY(-5);
})

sd.main(async () => {
    const pl = sd.Pointer(svg, "l", "b").my(coord.cy());
    const pr = sd.Pointer(svg, "r", "b").my(coord.cy());
    const pml = sd.Pointer(svg, "ml", "b").my(coord.cy());
    const pmr = sd.Pointer(svg, "mr", "b").my(coord.cy());
    MakeTracer(pl);
    MakeTracer(pr);
    MakeTracer(pml);
    MakeTracer(pmr);
    const path = coord.child(1);
    let l = path.x();
    let r = path.mx();
    await sd.pause();
    pl.cx(l).startAnimate().opacity(1).endAnimate();
    pr.cx(r).startAnimate().opacity(1).endAnimate();
    let cnt = 0;
    while (l <= r && (++cnt) <= 10) {
        await sd.pause();
        const ml = l + (r - l) / 3;
        const mr = r - (r - l) / 3;
        if (!pml.opacity()) pml.cx(ml).startAnimate().opacity(1).endAnimate();
        else pml.startAnimate().cx(ml).endAnimate();
        if (!pmr.opacity()) pmr.cx(mr).startAnimate().opacity(1).endAnimate();
        else pmr.startAnimate().cx(mr).endAnimate();
        if (coord.child(1).globalY(coord.coordX(ml)) < coord.child(1).globalY(coord.coordX(mr))) {
            await sd.pause();
            pmr.startAnimate().opacity(0).endAnimate();
            pr.startAnimate().cx(r = mr).endAnimate();
        } else {
            await sd.pause();
            pml.startAnimate().opacity(0).endAnimate();
            pl.startAnimate().cx(l = ml).endAnimate();
        }
    }
})

function MakeTracer(pointer) {
    pointer.childAs(new sd.Line(pointer).strokeDashArray([2, 2]), function(parent, child) {
        child.source(parent.target());
        child.target([parent.cx(), coord.child(1).trimGlobalY(coord.coordX(parent.cx()))]);
    })
    pointer.childAs("circle", new sd.Circle(pointer).r(5).strokeDashArray([2, 2]).color(C.grey), function(parent, child) {
        child.cx(parent.cx());
        child.cy(coord.child(1).trimGlobalY(coord.coordX(child.cx())));
    })
}