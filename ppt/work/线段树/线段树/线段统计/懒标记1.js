import * as sd from "@/sd";
import { TagAnalyzer } from "../_/TagAnalyzer";

const svg = sd.svg();
const R = sd.rule();
const C = sd.color();
const analyzer = new TagAnalyzer(svg, 8, "cnt", "col");

sd.init(() => {});

sd.main(async () => {
    await sd.pause();
    const tag = new sd.Text(svg, "1")
        .mx(analyzer.element(1).x() - 10)
        .cy(analyzer.element(1).cy())
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
    analyzer.element(1).startAnimate().color(C.blue).endAnimate();
    await sd.pause();
    const col = analyzer.tag();
    col.startAnimate()
        .text("1", [[tag, "1"]])
        .endAnimate();
    const sum = analyzer.sum();
    sum.startAnimate().text("r-l+1").endAnimate();
    analyzer.element(1).forEachElement(element => {
        element.startAnimate().color(C.orange).value(1).endAnimate();
    });
});
