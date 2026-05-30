import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const graph = new sd.BipartiteGraph(svg);
const data = [
    [1, 3],
    [1, 4],
    [3, 2],
    [3, 1],
    [5, 5],
    [4, 5]
];

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        graph.newNode(`X${i}`, 0);
        graph.newNode(`Y${i}`, 1);
    }
    data.forEach(item => {
        graph.newLink(`X${item[0]}`, `Y${item[1]}`);
    });
    graph.color("X1", C.blue);
    graph.color("X3", C.blue);
    graph.color("Y5", C.blue);
})

sd.main(async () => {
    
})