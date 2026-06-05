import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const n = 4;
const tot = 6;
const grid = new sd.Grid(svg).startN(1).startM(1).n(n).m(n).x(40).y(40);
const graph = new sd.BipartiteGraph(svg).cx(grid.cx()).y(grid.my() + 40);
const data = `
.***
*.*.
****
**.*
`
const mp = I.readCharMatrix(data, n, n);
const row = sd.make2d(10, 10);
const col = sd.make2d(10, 10);
let rowId = 0;
let colId = 0;

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            grid.value(i, j, mp[i][j]);
        }
    }
    for (let i = 1; i <= tot; i++) {
        graph.newNode(`R${i}`, 0).update().opacity(`R${i}`, 0);
        graph.newNode(`C${i}`, 1).update().opacity(`C${i}`, 0);
    }
})

sd.main(async () => {
    const focus = sd.Focus(grid);

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            if (mp[i][j] == "*") {
                await sd.pause();
                const sj = j; rowId++;
                while (j <= n && mp[i][j] == "*") {
                    row[i][j] = rowId;
                    j++;
                }
                focus.startAnimate().focus(i, sj, i, j-1).endAnimate();
                graph.startAnimate().opacity(`R${rowId}`, 1).endAnimate();
            }
        }
    }

    for (let j = 1; j <= n; j++) {
        for (let i = 1; i <= n; i++) {
            if (mp[i][j] == "*") {
                await sd.pause();
                const si = i; colId++;
                while (i <= n && mp[i][j] == "*") {
                    col[i][j] = colId;
                    i++;
                }
                focus.startAnimate().focus(si, j, i-1, j).endAnimate();
                graph.startAnimate().opacity(`C${colId}`, 1).endAnimate();
            }
        }
    }
    focus.startAnimate().focus(null).endAnimate();

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= n; j++) {
            const I = row[i][j];
            const J = col[i][j];
            if (!graph.element(`R${I}`, `C${J}`) && mp[i][j] == "*") {
                await sd.pause();
                grid.startAnimate().color(i, j, C.orange).endAnimate();
                graph.startAnimate().newLink(`R${I}`, `C${J}`).endAnimate();
                await sd.pause();
                grid.startAnimate().color(i, j, C.white).endAnimate();
            }
        }
    }
})
