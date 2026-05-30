import * as sd from "@/sd";
import { SegmentTree } from "../_/SegmentTree";
import { Timeline } from "../_/Timeline";

const svg = sd.svg();
const V = sd.vec();
const R = sd.rule();
const C = sd.color();
const EN = sd.enter();
const EX = sd.exit();
const m = 4;
const n = 6;
const MAXT = 3;
const links = [
    [1, 2, 0, "mx", "my"],
    [1, 4, 0, "mx", "cy"],
    [2, 3, 1, "mx", "cy"],
    [3, 4, 1, "mx", "y"],
    [1, 6, 2, "x", "my"],
    [6, 5, 2, "mx", "cy"],
    [1, 5, 3, "x", "my"],
];
const graph = new sd.TinyGraph(svg);
const tree = new SegmentTree(svg, m).cx(600).cy(200).layerHeight(120).stackWidth(50).stackHeight(22);
const timeline = new Timeline(svg, m).start(0).elementWidth(100);
sd.Label(timeline, "时间线");

sd.init(() => {
    timeline.x(tree.mx() + 60).y(tree.y() - 150);
    for (let i = 1; i <= n; i++) graph.newNode(i);
    links.forEach(link => {
        graph.link(link[0], link[1]);
        graph.element(link[0], link[1]).value(link[2], R.pointAtPathByRate(0.5, link[3], link[4]));
    });
    graph.cx(timeline.cx()).y(timeline.my() + 250);
});

sd.main(async () => {
    let cnt = 0;
    for (let l = 0, r; l < links.length; l = r + 1) {
        cnt++;
        r = l;
        while (r + 1 < links.length && links[r + 1][2] === links[l][2]) r++;
        const time = links[l][2];
        if (time > 0) addImpact(0, time - 1, cnt, links.slice(l, r + 1));
        if (time < MAXT) addImpact(time + 1, MAXT, cnt, links.slice(l, r + 1));
    }
    await tree.dfsAysnc({
        onCreateMover,
        onEnter,
        onExit,
        onLeaf,
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

async function onLeaf(i) {
    await sd.pause();
    graph.forEachLink(link => {
        link.startAnimate();
        link.opacity(link.intValue() + 1 === i ? 0.2 : 1);
        link.endAnimate();
    });
}

async function addImpact(l, r, cnt, links) {
    const item = (x, y) => {
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
    const arr = new sd.ValueArray(svg).elementHeight(20).elementWidth(60);
    links.forEach(link => {
        arr.push(item(link[0], link[1]));
    });
    timeline.brace(l, r, cnt * 50 - 40, arr, 2);
    links.forEach(link => {
        tree.insert(l + 1, r + 1, item.bind(undefined, link[0], link[1]));
    });
}
