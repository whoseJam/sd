import * as sd from "@/sd";
import { SegmentTree } from "../_/SegmentTree";
import { Timeline } from "../_/Timeline";

const svg = sd.svg();
const V = sd.vec();
const R = sd.rule();
const C = sd.color();
const EN = sd.enter();
const EX = sd.exit();
const n = 4;
const tree = new SegmentTree(svg, n).cx(600).cy(200).layerHeight(120).stackWidth(50).stackHeight(22);
const timeline = new Timeline(svg, n);
sd.Label(timeline, "时间线");

sd.init(() => {
    timeline.cx(tree.cx()).y(tree.my() + 60);
});

sd.main(async () => {
    await addImpact(1, 3, 1, 2);
    await addImpact(1, 4, 2, 3);
    await addImpact(2, 3, 1, 3);
    await tree.dfsAysnc({
        onCreateMover,
        onEnter,
        onExit,
    });
});

function onCreateMover() {
    const graph = new sd.TinyGraph(svg).width(80).height(80);
    for (let i = 1; i <= n; i++) graph.newNode(i).element(i).r(10);
    graph.stack = [];
    return graph;
}

function onEnter(mover, elements) {
    mover.startAnimate();
    elements.forEach(element => {
        mover.childAs(element.onEnter(EN.moveTo()), (parent, child) => {
            child.source(parent.element(child.v1).center());
            child.target(parent.element(child.v2).center());
        });
        mover.stack.push(element);
    });
    mover.endAnimate();
}

function onExit(mover, count) {
    const elements = [];
    for (let i = 0; i < count; i++) {
        const element = mover.stack.pop();
        elements.push(element);
        mover.eraseChild(element.onExit(EX.drop()));
        element
            .startAnimate()
            .target(V.add(element.source(), [30, 0]))
            .endAnimate();
    }
    return elements;
}

let cnt = 0;
async function addImpact(l, r, x, y) {
    const item = () => {
        const line = new sd.Line(svg).source(0, 0).target(30, 0);
        const v1 = new sd.Vertex(svg, x).r(10);
        const v2 = new sd.Vertex(svg, y).r(10);
        line.childAs(v1, (parent, child) => {
            child.center(parent.source());
        });
        line.childAs(v2, (parent, child) => {
            child.center(parent.target());
        });
        line.v1 = x;
        line.v2 = y;
        return line;
    };
    timeline.brace(l, r, cnt++ * 30 + 10, item(), 10);
    tree.insert(l, r, item);
}
