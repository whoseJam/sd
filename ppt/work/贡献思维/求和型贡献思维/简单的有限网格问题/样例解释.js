import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const grid = new sd.Grid(svg).n(5).m(8).startN(1).startM(1);
const data = [
    [2, 2],
    [5, 3],
    [3, 6]
];
const rect = new sd.Rect(svg).color(C.blue).width(20).height(20).drag(true);
rect.center(grid.element(3, 4).center());

sd.init(() => {
    data.forEach((pos) => {
        grid.value(pos[0], pos[1], new sd.Circle(svg).color(C.orange));
    })
})

sd.main(async () => {
})