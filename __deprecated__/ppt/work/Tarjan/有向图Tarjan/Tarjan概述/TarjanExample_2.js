import * as sd from "@/sd";
import { linkTo } from "../../_/LinkTo";
import { tarjan } from "../_/Tarjan";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.GridGraph(svg).width(300).height(150).m(2);

graph.outLinksAndNodes = function (u) {
    return [this.outLinks(u), this.outNodes(u)];
};

const stack = new sd.Stack(svg).dx(-180).elementHeight(30).elementWidth(80);
const links = [
    [1, 2],
    [2, 3],
    [2, 5],
    [4, 1],
    [5, 4],
    [5, 6],
    [6, 3],
];
const colorList = [C.orange, C.blue, C.green, C.red, C.yellow, C.cyan, C.grey, C.azure];
let SCC = -1;

sd.init(() => {
    graph.at(0, 0).newNode(1);
    graph.at(0, 1).newNode(2);
    graph.at(0, 2).newNode(3);
    graph.at(1, 0).newNode(4);
    graph.at(1, 1).newNode(5);
    graph.at(1, 2).newNode(6);
    links.forEach(link => {
        graph.newLink(link[0], link[1]);
        graph.element(link[0], link[1]).arrow();
    });
    stack.y(graph.element(1).y());
});

sd.main(async () => {
    await tarjan(graph, {
        async onPushStack(u) {
            await sd.pause();
            const text = graph.element(u).value();
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
            graph.element(u).startAnimate().strokeWidth(3).endAnimate();
        },
        async onNotSCC(u, low, ancestor) {
            await sd.pause();
            const link = onTraceBack(u, ancestor);
            link.stroke(C.grey).startAnimate().pointStoT().endAnimate().arrow();
        },
        async onPopStack(u) {
            await sd.pause();
            stack.startAnimate().color(stack.end(), colorList[SCC]).endAnimate();
            graph.startAnimate().color(u, colorList[SCC]).endAnimate();
            await sd.pause();
            stack.startAnimate().pop().endAnimate();
        },
    });
});

function onTraceBack(u, v) {
    const [du, dv] = [graph.element(u), graph.element(v)];
    if (String(u) === "4" && String(v) === "1") return sd.Link(du, dv, sd.Curve);
    if (String(u) === "2" && String(v) === "1") return sd.Link(du, dv, sd.Curve);
    return sd.Link(du, dv);
}
