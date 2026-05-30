import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const graph = new sd.DAG(svg).rankDir("LR").height(200);
const edges = [
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [6, 7],
    [7, 3],
    [3, 8],
    [8, 9]
];

sd.init(() => {
    for (let i = 1; i <= 9; i++) {
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
})

sd.main(async () => {
    await sd.pause();
    graph.startAnimate();
    color([1, 2, 3, 4, 5], C.red);
    color([6, 7], C.deepSkyBlue);
    color([8, 9], C.green);
    graph.endAnimate();
})

function color(path, col) {
    path.forEach(node => {
        graph.color(node, col);
    })
}