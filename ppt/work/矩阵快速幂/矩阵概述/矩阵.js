import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const m = 3;
const matrix = new sd.Math(
    svg,
    `
\\begin{pmatrix}
a_{1,1} & a_{1,2} & a_{1,3}\\\\
a_{2,1} & a_{2,2} & a_{2,3}\\\\
a_{3,1} & a_{3,2} & a_{3,3}\\\\
a_{4,1} & a_{4,2} & a_{4,3}\\\\
a_{5,1} & a_{5,2} & a_{5,3}\\\\
\\end{pmatrix}
`
);

sd.init(() => {});

sd.main(async () => {
    const l1 = [];
    const l2 = [];
    await sd.pause();
    for (let i = 1; i < m; i++) {
        const line = new sd.Line(svg);
        line.source(matrix.kx(i / m), matrix.y());
        line.target(matrix.kx(i / m), matrix.my());
        line.stroke(C.red).startAnimate().pointStoT().endAnimate();
        l1.push(line);
    }
    await sd.pause();
    l1.forEach(line => line.startAnimate().fadeStoT().endAnimate());
    await sd.pause();
    for (let i = 1; i < n; i++) {
        const line = new sd.Line(svg);
        line.source(matrix.x(), matrix.ky(i / n));
        line.target(matrix.mx(), matrix.ky(i / n));
        line.stroke(C.red).startAnimate().pointStoT().endAnimate();
        l2.push(line);
    }
    await sd.pause();
    l2.forEach(line => line.startAnimate().fadeStoT().endAnimate());
});
