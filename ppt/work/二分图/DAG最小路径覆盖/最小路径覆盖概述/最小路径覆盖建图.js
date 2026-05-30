import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.DAG(svg).rankDir("LR").height(200);
const bi = new sd.BipartiteGraph(svg).cx(graph.cx()).y(graph.my() + 40).height(200);
const edges = [
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5]
];

sd.init(() => {
    for (let i = 1; i <= 5; i++) {
        graph.newNode(i);
    }
    function link(u, v) {
        graph.newLink(u, v)
            .element(u, v)
            .arrow();
    }
    edges.forEach(edge => {
        link(edge[0], edge[1]);
    });
    for (let i = 1; i <= 5; i++) {
        bi.newNode(`A${i}`, 0);
        bi.newNode(`B${i}`, 1);
    }
    edges.forEach(edge => {
        bi.newLink(`A${edge[0]}`, `B${edge[1]}`);
    })
})

sd.main(async () => {
    await sd.pause();
    graph.startAnimate();
    colorNode(graph, [1, 3, 5], C.red);
    graph.endAnimate();
    bi.startAnimate();
    colorEdge(bi, [["A1", "B3"], ["A3", "B5"]], C.red, 2);
    bi.endAnimate();
})

function colorNode(graph, path, col) {
    path.forEach(node => {
        graph.color(node, col);
    });
}

function colorEdge(graph, path, col, width) {
    path.forEach(edge => {
        graph.element(edge[0], edge[1])
            .stroke(col)
            .strokeWidth(width);
    });
}