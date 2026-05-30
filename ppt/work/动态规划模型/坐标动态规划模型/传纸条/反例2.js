import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data1 = [
    [10, 10, 20],
    [0, 10, 0],
    [20, 10, 10],
];
const data2 = [
    [0, 0, 20],
    [0, 0, 0],
    [20, 0, 0],
];
const path1 = [
    [1, 1],
    [1, 2],
    [2, 2],
    [3, 2],
    [3, 3],
];
const path2 = [
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [3, 3],
];
const grid1 = makeGrid(data1);
const grid2 = makeGrid(data1).dx(160);
const grid3 = makeGrid(data2).dx(320);
const grid4 = makeGrid(data2).dx(480);
const grid5 = makeGrid(data1)
    .cx((grid1.x() + grid4.mx()) / 2)
    .dy(160);

sd.init(() => {
    path1.forEach(([x, y]) => {
        grid2.value(x, y).color(C.red);
    });
    path2.forEach(([x, y]) => {
        grid4.value(x, y).color(C.red);
    });
});

sd.main(async () => {});

function makeGrid(data) {
    const grid = new sd.Grid(svg).startN(1).startM(1);
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            grid.insert(i + 1, j + 1, data[i][j]);
        }
    }
    return grid;
}
