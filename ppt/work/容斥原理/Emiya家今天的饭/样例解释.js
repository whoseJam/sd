import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const n = 3;
const m = 3;
const grid = new sd.Grid(svg);
const A = I.readIntMatrix(`
1 2 3
4 5 0
6 0 0`, n, m);

sd.init(() => {
    grid.n(n).m(m).startN(1).startM(1);
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            grid.value(i, j, A[i][j]);
            let tmp = 0;
            grid.element(i, j).onClick(() => {
                sd.inter(async () => {
                    tmp ^= 1;
                    grid.startAnimate().color(i, j, tmp ? C.orange : C.white).endAnimate();
                })
            })
        }
    }
    sd.Brace(grid).brace(grid.element(1, 1), grid.element(n, 1), "l").value("n种烹饪方法");
    sd.Brace(grid).brace(grid.element(n, 1), grid.element(n, m), "b").value("m种食材");
})

sd.main(async () => {

})