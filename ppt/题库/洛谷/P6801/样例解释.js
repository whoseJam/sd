import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg);
const data = [1, 1, 3, 3, 2, 2, 2, 1, 2, 2];
const colors = [C.grey, C.grey, C.white,  C.white, C.grey, C.grey,C.grey, C.white, C.grey, C.grey];

sd.init(() => {
    grid.axis("col").align("my");
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i]; j++) {
            grid.insert(i, j);
        }
    }
})

sd.main(async () => {
    await sd.pause();
    grid.startAnimate();
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i]; j++)
            grid.color(i, j, colors[i]);
    }
    grid.endAnimate();
})