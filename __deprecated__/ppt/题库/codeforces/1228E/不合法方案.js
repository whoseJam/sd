import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 6;
const grid = new sd.Grid(svg).n(n).m(n).startN(1).startM(1);

sd.init(() => {
    sd.Brace(grid).brace(grid.element(1, 1), grid.element(1, n)).value("n");
    sd.Brace(grid).brace(grid.element(1, 1), grid.element(n, 1), "l").value("n");
    grid.forEachElement((element, i, j) => {
        element.onClick(() => {
            sd.inter(async () => {
                const color = element.color().main === C.white ? C.red : C.white;
                grid.startAnimate();
                for (let i0 = 1; i0 <= n; i0++)
                    grid.color(i0, j, color);
                grid.endAnimate();
            })
        })
    })
})

sd.main(async () => {

})