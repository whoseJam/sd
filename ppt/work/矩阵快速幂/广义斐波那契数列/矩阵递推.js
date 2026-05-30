import * as sd from "@/sd";
import { Matrix } from "../_/Matrix";

const svg = sd.svg();
const C = sd.color();
const data1 = [
    ["?", "?"],
    ["?", "?"],
];
const data2 = [["a_{n-1}"], ["a_{n-2}"]];
const data3 = [["a_{n}"], ["a_{n-1}"]];
const data4 = [
    ["p", "q"],
    [1, 0],
];
const matrix1 = new Matrix(svg, data1);
const matrix2 = new Matrix(svg, data2);
const matrix3 = new Matrix(svg, data3);

sd.init(() => {
    matrix2.cy(matrix1.cy()).x(matrix1.mx() + 50);
    matrix3.cy(matrix1.cy()).x(matrix2.mx() + 50);
    matrix2.forEachElement(element => element.fontSize(15));
    matrix3.forEachElement(element => element.fontSize(15));
    new sd.Text(svg, "×").cx((matrix1.mx() + matrix2.x()) / 2).cy(matrix1.cy());
    new sd.Text(svg, "=").cx((matrix2.mx() + matrix3.x()) / 2).cy(matrix1.cy());
});

sd.main(async () => {
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
                ans += String(data1[i][k]) + String(data2[k][j]);
                sum += data1[i][k] * data2[k][j];
                if (k !== data1[0].length - 1) ans += "+";
                mapping.push([matrix1.element(i, k), data1[i][k], data1[i][k]]);
                mapping.push([matrix2.element(k, j), data2[k][j], data2[k][j]]);
            }
            matrix1.endAnimate();
            matrix2.endAnimate();
            await sd.pause();
            const math = new sd.Math(svg)
                .fontSize(15)
                .x(80)
                .y(matrix1.my() + 20)
                .startAnimate()
                .text(ans, mapping)
                .endAnimate();
            await sd.pause();
            matrix3.startAnimate().color(i, j, C.red).endAnimate();
            await sd.pause();
            {
                let ans = "";
                const mapping = [];
                for (let k = 0; k < data4[0].length; k++) {
                    ans = ans + String(data4[i][k]) + String(data2[k][j]);
                    if (k !== data4[0].length - 1) ans += "+";
                    mapping.push([data1[i][k], data4[i][k]]);
                    mapping.push([data2[k][j], data2[k][j]]);
                }
                math.startAnimate().text(ans, mapping).endAnimate();
            }
            await sd.pause();
            matrix1.startAnimate();
            matrix2.startAnimate();
            matrix3.startAnimate();
            for (let k = 0; k < data1[0].length; k++) {
                matrix1.text(i, k, data4[i][k]);
                matrix1.color(i, k, C.black);
                matrix2.color(k, j, C.black);
                matrix3.element(i, j).text(data3[i][j], [[math, data3[i][j]]]);
            }
            matrix1.endAnimate();
            matrix2.endAnimate();
            matrix3.endAnimate();
            await sd.pause();
            matrix3.startAnimate().color(i, j, C.black).endAnimate();
        }
    }
});
