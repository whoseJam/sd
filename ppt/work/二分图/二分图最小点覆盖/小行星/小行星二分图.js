import * as sd from "@/sd";

const svg = sd.svg();
const n = 5;
const graph = new sd.BipartiteGraph(svg);
const data = [
    [1, 3],
    [2, 2],
    [5, 1],
    [3, 2]
];

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        graph.newNode(`R${i}`, 0);
        graph.newNode(`C${i}`, 1);
    }
    data.forEach(item => {
        graph.newLink(`R${item[0]}`, `C${item[1]}`);
    })
})

sd.main(async () => {

})
