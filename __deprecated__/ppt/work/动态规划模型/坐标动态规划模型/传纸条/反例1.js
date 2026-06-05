import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const data = [
    [1, 5, 9],
    [3, 0, 4],
    [7, 1, 5],
];
const path1 = [
    [1, 1],
    [1, 2],
    [1, 3],
    [2, 3],
    [3, 3],
];
const path2 = [
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [3, 3],
];
const grid = new sd.Grid(svg).startN(1).startM(1);

sd.init(() => {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            grid.insert(i + 1, j + 1, data[i][j]);
        }
    }
});

sd.main(async () => {
    await clear(path1);
    await clear(path2);
});

async function clear(path) {
    await sd.pause();
    path.forEach(([x, y]) => {
        const text = grid.value(x, y);
        text.startAnimate().color(C.red).endAnimate();
    });
    await sd.pause();
    path.forEach(([x, y]) => {
        const text = grid.value(x, y);
        text.startAnimate().text(0).endAnimate();
    });
    await sd.pause();
    path.forEach(([x, y]) => {
        const text = grid.value(x, y);
        text.startAnimate().color(C.black).endAnimate();
    });
}
