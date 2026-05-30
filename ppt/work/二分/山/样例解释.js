import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const coord = new sd.FixGapCoord(svg).ticks("y", 5).ticks("x", 12);
const light = new sd.Circle(svg).r(3).color(C.yellow).drag(true).cx(coord.cx());
const locations = [
    [0, 0],
    [3, 1],
    [5, 2],
    [8, 1],
    [9, 2],
    [12, 3],
];
const circles = [];

sd.init(() => {
    for (let i = 0; i < locations.length; i++) {
        const [x, y] = locations[i];
        const circle = coord.drawCircle(x, y).r(3).color(C.black);
        if (circles.length > 0) sd.Link(circles[circles.length - 1], circle);
        circles.push(circle);
    }
});

sd.main(async () => {});
