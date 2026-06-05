import * as sd from "@/sd";
import { TagAnalyzer } from "../../线段树/_/TagAnalyzer";

const svg = sd.svg();
const data = [1, 2, 3, 1, 2, 3, 4, 2];
const analyzer = new TagAnalyzer(svg, 8, "16", "sqrt");

sd.init(() => {
    const array = analyzer.element(1);
    for (let i = 0; i < data.length; i++) array.value(i + 1, data[i]);
});

sd.main(async () => {
    await sd.pause();
    analyzer.sum().startAnimate().text(4).endAnimate();
    await sd.pause();
    const array = analyzer.element(1);
    array.startAnimate();
    for (let i = 1; i <= data.length; i++) {
        array.text(i, Math.floor(Math.sqrt(array.intValue(i))));
    }
    array.endAnimate();
});
