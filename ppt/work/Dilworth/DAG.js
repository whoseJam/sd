import * as sd from "@/sd";

let svg = sd.svg();
let C = sd.color();
let g = new sd.DAG(svg).cx(800).cy(300);
let n = 9, m = 10;
let e = [
    [1, 3], [1, 4], [2, 5], [3, 5], [4, 6],
    [5, 7], [5, 8], [6, 8], [7, 9], [8, 9]
];

for (let i = 1; i <= n; i++) g.newNode(i);
for (let i = 0; i < m; i++) {
    g.newLink(e[i][0], e[i][1]);
    g.element(e[i][0], e[i][1]).arrow();
}

