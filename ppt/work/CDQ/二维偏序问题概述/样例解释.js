import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const coord = new sd.Coord(svg).width(400).height(200).viewBox(-2, -2, 6, 6);
const data = [
    [1, 2],
    [-1, 0],
    [0, 3],
    [2, -1],
    [3, 1],
];

sd.init(() => {
    data.forEach(at => {
        new sd.Circle(svg).color(C.blue).r(6).center(coord.globalAt(at));
    });
});

sd.main(async () => {});
