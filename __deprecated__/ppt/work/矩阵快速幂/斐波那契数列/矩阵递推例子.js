import * as sd from "@/sd";
import { Matrix } from "../_/Matrix";

const svg = sd.svg();
const C = sd.color();
const data1 = [
    [1, 1],
    [1, 0],
];
const data2 = [[1], [1]];
const data3 = [["?"], ["?"]];
const matrix1 = new Matrix(svg, data1);
const matrix2 = new Matrix(svg, data2);
const matrix3 = new Matrix(svg, data3);

sd.init(() => {
    matrix2.cy(matrix1.cy()).x(matrix1.mx() + 50);
    matrix3.cy(matrix1.cy()).x(matrix2.mx() + 50);
    new sd.Text(svg, "×").cx((matrix1.mx() + matrix2.x()) / 2).cy(matrix1.cy());
    new sd.Text(svg, "=").cx((matrix2.mx() + matrix3.x()) / 2).cy(matrix1.cy());
});

sd.main(async () => {
    let data2_ = data2;
    let data3_ = data3;
    let matrix2_ = matrix2;
    let matrix3_ = matrix3;
    for (let n = 1; n <= 5; n++) {
        await multiply(data1, data2_, data3_, matrix1, matrix2_, matrix3_);
        await sd.pause();
        const x2 = matrix2_.x();
        const x3 = matrix3_.x();
        matrix3_.startAnimate().x(x2).endAnimate();
        matrix2_.startAnimate().opacity(0).endAnimate();
        matrix2_.x(x3);
        for (let i = 0; i < data2.length; i++) matrix2_.element(i, 0).text("?");
        matrix2_.startAnimate().opacity(1).endAnimate();
        [data2_, data3_] = [data3_, data2_];
        [matrix2_, matrix3_] = [matrix3_, matrix2_];
    }
});

async function multiply(data1, data2, data3, matrix1, matrix2, matrix3) {
    for (let i = 0; i < data3.length; i++) {
        for (let j = 0; j < data3[i].length; j++) {
            await sd.pause();
            matrix1.startAnimate();
            matrix2.startAnimate();
            let sum = 0;
            let ans = "";
            const mapping = [];
            for (let k = 0; k < data1[0].length; k++) {
                matrix1.color(i, k, C.textBlue);
                matrix2.color(k, j, C.textBlue);
                ans += String(data1[i][k]) + "\\times " + String(data2[k][j]);
                sum += data1[i][k] * data2[k][j];
                if (k !== data1[0].length - 1) ans += "+";
                mapping.push([matrix1.element(i, k), data1[i][k], data1[i][k]]);
                mapping.push([matrix2.element(k, j), data2[k][j], data2[k][j]]);
            }
            data3[i][j] = sum;
            matrix1.endAnimate();
            matrix2.endAnimate();
            await sd.pause();
            const cx = (matrix1.x() + matrix3.mx()) / 2;
            const math = new sd.Math(svg)
                .x(70)
                .y(matrix1.my() + 40)
                .startAnimate()
                .text(ans, mapping)
                .endAnimate();
            await sd.pause();
            math.startAnimate().text(sum).cx(cx).color(C.red).endAnimate();
            await sd.pause();
            matrix3.startAnimate();
            matrix3
                .element(i, j)
                .text(sum, [[math, sum]])
                .color(C.black);
            matrix3.endAnimate();
            matrix1.startAnimate();
            matrix2.startAnimate();
            for (let k = 0; k < data1[0].length; k++) {
                matrix1.color(i, k, C.black);
                matrix2.color(k, j, C.black);
            }
            matrix1.endAnimate();
            matrix2.endAnimate();
        }
    }
}
