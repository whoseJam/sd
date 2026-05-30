import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const n = 3,
    m = 5;
const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);
const data = I.readCharMatrix(
    `
\\\\/\\\\
\\\\///
/\\\\\\\\`,
    n,
    m
);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            grid.element(i, j).line = new sd.Line(grid).strokeWidth(4);
            if (data[i][j] == "/") {
                mark1(i, j);
            } else {
                mark2(i, j);
            }
            let cnt = 0;
            grid.element(i, j).onClick(element => {
                sd.inter(async () => {
                    cnt = (cnt + 1) % 2;
                    grid.element(i, j).line.startAnimate();
                    if (element.tag === 1) mark2(i, j);
                    else mark1(i, j);
                    grid.element(i, j).line.endAnimate();
                    if (cnt) element.color(C.grey);
                    else element.color(C.white);
                });
            });
        }
    }
});

sd.main(async () => {});

function mark1(i, j) {
    const srcPos = [grid.element(i, j).x(), grid.element(i, j).my()];
    const tgtPos = [grid.element(i, j).mx(), grid.element(i, j).y()];
    grid.element(i, j).line.source(srcPos).target(tgtPos);
    grid.element(i, j).tag = 1;
}

function mark2(i, j) {
    const srcPos = [grid.element(i, j).x(), grid.element(i, j).y()];
    const tgtPos = [grid.element(i, j).mx(), grid.element(i, j).my()];
    grid.element(i, j).line.source(srcPos).target(tgtPos);
    grid.element(i, j).tag = 2;
}
