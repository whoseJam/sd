import * as sd from "@/sd";

const svg = sd.svg();
const C_ = sd.color();
const L = 20;
const A = 4;
const B = 7;
const C = 3;
const matrix1 = new sd.Rect(svg).width(B * L).height(A * L);
const matrix2 = new sd.Rect(svg).width(C * L).height(B * L);
const matrix3 = new sd.Rect(svg).width(C * L).height(A * L);

sd.init(() => {
    matrix2.x(matrix1.mx() + 50).cy(matrix1.cy());
    matrix3.x(matrix2.mx() + 50).cy(matrix1.cy());
    sd.Label(matrix1, "$A$", "tc");
    sd.Label(matrix2, "$B$", "tc");
    sd.Label(matrix3, "$C$", "tc");
    new sd.Text(svg, "×").cx((matrix1.mx() + matrix2.x()) / 2).cy(matrix1.cy());
    new sd.Text(svg, "=").cx((matrix2.mx() + matrix3.x()) / 2).cy(matrix1.cy());
});

sd.main(async () => {
    const m1 = new sd.Rect(svg)
        .color(C_.blue)
        .opacity(0)
        .width(B * L)
        .height(L);
    const m2 = new sd.Rect(svg)
        .color(C_.blue)
        .opacity(0)
        .width(L)
        .height(B * L);
    for (let i = 0; i < A; i++) {
        for (let j = 0; j < C; j++) {
            await sd.pause();
            if (i === 0 && j === 0) {
                m1.x(matrix1.x())
                    .y(matrix1.y() + i * L)
                    .startAnimate()
                    .opacity(1)
                    .endAnimate();
                m2.x(matrix2.x() + j * L)
                    .y(matrix2.y())
                    .startAnimate()
                    .opacity(1)
                    .endAnimate();
            } else {
                m1.startAnimate()
                    .x(matrix1.x())
                    .y(matrix1.y() + i * L)
                    .endAnimate();
                m2.startAnimate()
                    .x(matrix2.x() + j * L)
                    .y(matrix2.y())
                    .endAnimate();
            }
            await sd.pause();
            const m3 = new sd.Rect(svg)
                .color(C_.blue)
                .x(matrix3.x() + j * L)
                .y(matrix3.y() + i * L)
                .width(L)
                .height(L)
                .opacity(0)
                .startAnimate()
                .opacity(1)
                .endAnimate();
            await sd.pause();
            m3.startAnimate().color(C_.grey).endAnimate();
        }
    }
});
