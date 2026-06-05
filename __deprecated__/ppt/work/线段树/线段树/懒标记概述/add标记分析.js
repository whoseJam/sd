import * as sd from "@/sd";
import { TagAnalyzer } from "../_/TagAnalyzer";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const analyzer = new TagAnalyzer(svg, 8, "mn", new sd.Text(svg, "+3"));
const lc = x => x * 2;
const rc = x => x * 2 + 1;

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    const tag = new sd.Text(svg, "+2")
        .mx(analyzer.element(1).x() - 10)
        .cy(analyzer.element(1).cy())
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    analyzer.element(1).startAnimate().color(C.blue).endAnimate();
    await sd.pause();
    const sum = analyzer.sum();
    sum.startAnimate()
        .text(`mn+2`, [[tag, "+2"]], false)
        .endAnimate();
    const add = analyzer.tag();
    add.startAnimate()
        .text("+5", [[tag, "5"]])
        .endAnimate();
    await sd.pause();
    analyzer.element(1).startAnimate().color(C.white).endAnimate();
    await onPushDown(1);
});

function pushAdd(x, d) {
    const node = analyzer.element(x);
    const add = node.child("tag");
    if (add)
        add.startAnimate()
            .text(convert(+add.text() + d))
            .endAnimate();
    else
        node.startAnimate()
            .childAs("tag", new sd.Text(node, convert(d)), R.aside("rc"))
            .endAnimate();
}

async function onPushDown(x) {
    const node = analyzer.element(x);
    const add = node.child("tag");
    if (!add || add.text() === " ") return;
    await sd.pause();
    add.startAnimate().opacity(0.5);
    pushAdd(lc(x), +add.text());
    pushAdd(rc(x), +add.text());
    const ladd = analyzer.element(lc(x)).child("tag");
    const radd = analyzer.element(rc(x)).child("tag");
    const lline = new sd.Line(svg).source(add.cx(), add.my()).target(ladd.cx(), ladd.y()).startAnimate().pointStoT().endAnimate().arrow();
    const rline = new sd.Line(svg).source(add.cx(), add.my()).target(radd.cx(), radd.y()).startAnimate().pointStoT().endAnimate().arrow();
    await sd.pause();
    node.startAnimate().eraseChild(add).endAnimate();
    lline.startAnimate().fadeStoT().endAnimate().remove();
    rline.startAnimate().fadeStoT().endAnimate().remove();
}

function convert(v) {
    if (v > 0) return "+" + v;
    if (v < 0) return v;
    return " ";
}
