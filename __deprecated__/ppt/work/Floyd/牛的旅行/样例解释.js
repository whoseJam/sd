import * as sd from "@/sd";

const svg = sd.svg();
const I = sd.input();
const data = [
    [10, 10],
    [15, 10],
    [20, 10],
    [15, 15],
    [20, 15],
    [30, 15],
    [25, 10],
    [30, 10],
];
const n = data.length;
const matrix = I.readCharMatrix(
    `
01000000
10111000
01001000
01001000
01110000
00000010
00000101
00000010
    `,
    n,
    n
);
const circles = sd.make1d(n + 5, undefined);

sd.init(() => {
    data.forEach((item, i) => {
        circles[i + 1] = new sd.Circle(svg).r(4).center(pos(item));
    });
    for (let i = 1; i <= n; i++)
        for (let j = 1; j <= n; j++) {
            if (matrix[i][j] === "1") sd.Link(circles[i], circles[j]);
        }
});

sd.main(async () => {});

function pos(item) {
    return [item[0] * 10, item[1] * 10];
}
