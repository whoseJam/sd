import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const n = 5;
const grid = new sd.Grid(svg).startN(1).startM(1).n(n).m(n).x(40).y(40);
const data = [
    [1, 3],
    [2, 2],
    [5, 1],
    [3, 2]
];

sd.init(() => {
    data.forEach(item => {
        grid.element(item[0], item[1]).value(new sd.Circle(svg).color(C.grey));
    })
})

sd.main(async () => {

})
