import * as sd from "@/sd";
import { TagAnalyzer } from "../../线段树/_/TagAnalyzer";

const svg = sd.svg();
const data = [1, 1, 0, 1, 0, 0, 1, 1];
const analyzer = new TagAnalyzer(svg, 8, "5", "sqrt");

sd.init(() => {
    for (let i = 0; i < data.length; i++) analyzer.element(1).value(i + 1, data[i]);
    for (let i = 0; i < data.length / 2; i++) analyzer.element(2).value(i + 1, data[i]);
    for (let i = data.length / 2; i < data.length; i++) analyzer.element(3).value(i + 1, data[i]);
});

sd.main(async () => {});
