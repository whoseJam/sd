import * as sd from "@/sd";
import { linkTo } from "../../_/LinkTo";
import { tarjan } from "../_/Tarjan";
import { TreeGraph } from "../_/TreeGraph";

const svg = sd.svg();
const C = sd.color();
const stack = new sd.Stack(svg).dx(-180).elementHeight(30).elementWidth(80);
const n = 9;
const links = [
    [1, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [3, 6],
    [3, 7],
    [5, 8],
    [5, 9],
];
const externLinks = [
    [8, 2, sd.Line, {}],
    [5, 1, sd.Line, {}],
    [7, 6, sd.Line, {}],
    [6, 3, sd.Curve, {}],
];
const tree = new TreeGraph(svg, n, links, externLinks);
const colorList = [C.orange, C.blue, C.green, C.red, C.yellow, C.cyan, C.grey, C.azure];
let SCC = -1;

sd.init(() => {});

sd.main(async () => {
    await tarjan(tree, {
        async onPushStack(u) {
            await sd.pause();
            const text = tree.element(u).value();
            const text_ = new sd.Text(svg, u).fontSize(text.fontSize()).center(text.center());
            stack.startAnimate().pushFromExistValue(text_).endAnimate();
        },
        async onTreeLink(u, v, link) {
            await sd.pause();
            linkTo(link, C.textBlue);
        },
        async onAncestorLink(u, v, link) {
            await sd.pause();
            linkTo(link, C.red);
        },
        async onForwardLink(u, v, link) {
            await sd.pause();
            linkTo(link, C.orange);
        },
        async onCrossLink(u, v, link) {
            await sd.pause();
            linkTo(link, C.purple);
        },
        async onSCC(u) {
            await sd.pause();
            SCC++;
            tree.element(u).startAnimate().strokeWidth(3).endAnimate();
        },
        async onNotSCC(u, low, ancestor) {
            await sd.pause();
            const link = onTraceBack(u, ancestor);
            link.stroke(C.grey).startAnimate().pointStoT().endAnimate().arrow();
        },
        async onPopStack(u) {
            await sd.pause();
            stack.startAnimate().color(stack.end(), colorList[SCC]).endAnimate();
            tree.startAnimate().color(u, colorList[SCC]).endAnimate();
            await sd.pause();
            stack.startAnimate().pop().endAnimate();
        },
    });
});

function onTraceBack(u, v) {
    const [du, dv] = [tree.element(u), tree.element(v)];
    return sd.Link(du, dv, sd.Curve);
}
