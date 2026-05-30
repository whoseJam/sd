import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const a = 5;
const b = 4;
const c = 6;
const d = 4;
const grid = new sd.Grid(svg).startN(1).startM(1);
const delta = sd.make2d(20, 20);

sd.init(() => {
    grid.n(b).m(a);
    for (let i = 1; i <= d; i++) {
        for (let j = 1; j <= a + c; j++) {
            grid.insert(i + b, j, null);
        }
    }
    sd.Brace(grid).brace(grid.element(1, 1), grid.element(1, a), "t").value("a");
    sd.Brace(grid).brace(grid.element(1, a), grid.element(b, a), "r").value("b");
    sd.Brace(grid)
        .brace(grid.element(b + 1, a + 1), grid.element(b + 1, a + c), "t")
        .value("c");
    sd.Brace(grid)
        .brace(grid.element(b + 1, a + c), grid.element(b + d, a + c), "r")
        .value("d");

    grid.forEachElement((element, rowId, colId) => {
        let flg = 1;
        element.onClick(() => {
            sd.inter(async () => {
                for (let i = 1; i <= b + d; i++) {
                    const lim = i <= b ? a : a + c;
                    for (let j = 1; j <= lim; j++) {
                        if (i === rowId || j === colId) {
                            delta[i][j] += flg;
                            if (delta[i][j] === 1) grid.element(i, j).startAnimate().color(C.blue).endAnimate();
                            else if (delta[i][j] === 0) grid.element(i, j).startAnimate().color(C.white).endAnimate();
                        }
                    }
                }
                if (flg === 1)
                    grid.element(rowId, colId)
                        .after(0)
                        .startAnimate()
                        .value(new sd.Circle(svg).color(C.orange).r(15), R.center())
                        .endAnimate();
                else grid.element(rowId, colId).after(0).startAnimate().value(null).endAnimate();
                flg = -flg;
            });
        });
    });
});

sd.main(async () => {
    await sd.pause();
});
