import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const coord = new sd.Coord(svg).viewBox(-3, -3, 13, 13).width(600).height(300);
const circles = [];
const data = [
    [3, 5],
    [-1, 2],
    [6, -2],
    [0, 7],
    [4, 1],
    [-2, -1],
    [7, 3],
    [2, 6],
    [5, -2],
    [1, 4],
];

sd.init(() => {
    data.forEach(([x, y]) => {
        const circle = new sd.Circle(svg).color(C.blue).r(6).center(coord.globalAt(x, y));
        circles.push(circle);
        circle.attrX = x;
        circle.attrY = y;
    });
});

sd.main(async () => {
    await sd.pause();
    const links = [];
    for (let i = 0; i < circles.length; i++) {
        for (let j = 0; j < circles.length; j++) {
            if (circles[i].attrX < circles[j].attrX && circles[i].attrY < circles[j].attrY) {
                links.push(sd.Link(circles[i], circles[j]).startAnimate().pointStoT().endAnimate().arrow());
            }
        }
    }
    await sd.pause();
    links.forEach((link, idx) => {
        link.after(idx * 300)
            .startAnimate()
            .strokeWidth(3)
            .color(C.red)
            .endAnimate();
        link.startAnimate().strokeWidth(1).color(C.black).endAnimate();
    });
});
