import * as sd from "@/sd";
import { buildSuffixMachineWithLabel } from "../_/BuildSuffixMachineWithLabel";
import { insertOnSuffixMachine } from "../_/InsertOnSuffixMachine";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const tree = new sd.Tree(svg).width(300).layerHeight(100).x(300);
const graph = new sd.GridGraph(svg).width(100).height(200).cx(100);
const str = "abaab";
const arr = new sd.Array(svg).pushArray(str);
const MAXC = 3;

const nodeLayout = {
    1: [0, 0],
    2: [0.5, 0],
    3: [0, 1],
    4: [0.5, 1],
    5: [1, 0],
    6: [1, 1],
};

function onCreateNewNodeOnGraph1(u) {
    const layout = nodeLayout[u];
    graph.at(layout[0], layout[1]).newNode(u);
}

sd.init(async () => {
    arr.cx(280).y(graph.my() + 160);
    await buildSuffixMachineWithLabel(graph, tree, str, MAXC, {
        onCreateNewNodeOnGraph: onCreateNewNodeOnGraph1,
    });
});

function onCreateNewNodeOnGraph2(u) {
    graph.at(0.5, 2).newNode(u);
}

function onCreateNewNodeOnTree(u) {
    return new sd.Vertex(svg, u).cx(tree.element(4).cx()).cy(tree.element(4).cy() + tree.layerHeight());
}

function onCreateNewLinkOnGraph(u, v) {
    graph.newLink(u, v);
    const link = graph.element(u, v);
    let rule = undefined;
    if (u === 1) rule = R.pointAtPathByRate(0.4, "mx", "y");
    else if (u === 3) rule = R.pointAtPathByRate(0.5, "x", "my");
    else rule = R.pointAtPathByRate(0.5, "x", "y");
    link.startAnimate().pointStoT().value("a", rule).endAnimate().arrow();
}

sd.main(async () => {
    await insertOnSuffixMachine(graph, tree, arr, "a", MAXC, {
        onCreateNewNodeOnGraph: onCreateNewNodeOnGraph2,
        onCreateNewLinkOnGraph,
        onCreateNewNodeOnTree,
        labelLocationForNewNodeOnTree: "lt",
    });
});
