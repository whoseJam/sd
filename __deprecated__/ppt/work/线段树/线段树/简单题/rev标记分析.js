import * as sd from "@/sd";
import { TagAnalyzer } from "../_/TagAnalyzer";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const analyzer = new TagAnalyzer(svg, 4, null, "$r_x$").width(600);
const lc = x => x * 2;
const rc = x => x * 2 + 1;

sd.init(() => {
    analyzer.element(2).childAs("tag", new sd.Math(svg, "r_l"), R.aside("rc"));
    analyzer.element(3).childAs("tag", new sd.Math(svg, "r_r"), R.aside("rc"));
});

sd.main(async () => {
    await sd.pause();
    const tag = new sd.Math(svg, "1")
        .mx(analyzer.element(1).x() - 10)
        .cy(analyzer.element(1).cy())
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    analyzer.element(1).startAnimate().color(C.blue).endAnimate();
    await sd.pause();
    const rev = analyzer.tag();
    rev.startAnimate()
        .text("r_x\\otimes 1", [
            [tag, "1"],
            ["r_x", "r_x"],
        ])
        .endAnimate();
    await sd.pause();
    rev.startAnimate().text("r_x").endAnimate();
    await sd.pause();
    analyzer.element(1).startAnimate().color(C.white).endAnimate();
    await onPushDown(1);
});

function pushRev(x) {
    const node = analyzer.element(x);
    const rev = node.child("tag");
    rev.startAnimate()
        .text(rev.text() + "\\otimes r_x", [[rev.text(), rev.text()]])
        .endAnimate();
}

async function onPushDown(x) {
    const node = analyzer.element(x);
    const add = node.child("tag");
    if (!add || add.text() === " ") return;
    await sd.pause();
    add.startAnimate().opacity(0.5);
    pushRev(lc(x), +add.text());
    pushRev(rc(x), +add.text());
    const ladd = analyzer.element(lc(x)).child("tag");
    const radd = analyzer.element(rc(x)).child("tag");
    const lline = new sd.Line(svg).source(add.cx(), add.my()).target(ladd.cx(), ladd.y()).startAnimate().pointStoT().endAnimate().arrow();
    const rline = new sd.Line(svg).source(add.cx(), add.my()).target(radd.cx(), radd.y()).startAnimate().pointStoT().endAnimate().arrow();
    await sd.pause();
    node.startAnimate().eraseChild(add).endAnimate();
    lline.startAnimate().fadeStoT().endAnimate().remove();
    rline.startAnimate().fadeStoT().endAnimate().remove();
}
