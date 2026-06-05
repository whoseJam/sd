import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const I = sd.input();
const n = 3, m = 5;
const grid = new sd.Grid(svg).n(n).m(m).startN(1).startM(1);
const lightLines = [];
const data = I.readCharMatrix(`
\\\\/\\\\
\\\\///
/\\\\\\\\`, n, m);

sd.init(() => {
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            let tmp;
            if (data[i][j] == "/") {
                mark1(i, j, new sd.Line(grid).strokeWidth(4));
                mark2(i, j, tmp = new sd.Line(grid).stroke(C.grey).opacity(0));
            } else {
                mark2(i, j, new sd.Line(grid).strokeWidth(4));
                mark1(i, j, tmp = new sd.Line(grid).stroke(C.grey).opacity(0));
            }
            lightLines.push(tmp);
        }
    }
})

sd.main(async () => {
    await sd.pause();
    for (let i = 1; i <= n + 1; i++) {
        for (let j = 1; j <= m + 1; j++) {
            const make = () =>  new sd.Circle(grid).color(C.ORANGE).r(5);
            const circ = make();
            const x = grid.x() + grid.elementWidth() * (j-1);
            const y = grid.y() + grid.elementHeight() * (i-1);
            circ.cx(x).cy(y).opacity(0).startAnimate().opacity(1).endAnimate();
        }
    }
    await sd.pause();
    lightLines.forEach(l => l.startAnimate().opacity(1).endAnimate());
})

function mark1(i, j, l) {
    const srcPos = [
        grid.element(i, j).x(),
        grid.element(i, j).my()
    ];
    const tgtPos = [
        grid.element(i, j).mx(),
        grid.element(i, j).y()
    ];
    l.source(srcPos).target(tgtPos);
}

function mark2(i, j, l) {
    const srcPos = [
        grid.element(i, j).x(),
        grid.element(i, j).y()
    ];
    const tgtPos = [
        grid.element(i, j).mx(),
        grid.element(i, j).my()
    ];
    l.source(srcPos).target(tgtPos);
}