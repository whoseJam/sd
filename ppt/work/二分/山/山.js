import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const V = sd.vec();
const coord = new sd.FixGapCoord(svg).ticks("y", 5).ticks("x", 12);
const plane = new sd.Line(svg).target(40, 0).width(coord.width()).strokeDashArray([5, 5]).y(coord.globalY(4));
const locations = [
    [0, 0],
    [3, 1],
    [5, 2],
    [8, 1],
    [9, 2],
    [12, 1],
];
const circles = [];
const links = [];

sd.init(() => {
    for (let i = 0; i < locations.length; i++) {
        const [x, y] = locations[i];
        const circle = coord.drawCircle(x, y).r(3).color(C.black);
        if (circles.length > 0) links.push(sd.Link(circles[circles.length - 1], circle));
        else links.push(null);
        circles.push(circle);
    }
});

sd.main(async () => {
    for (let i = 1; i < locations.length; i++) {
        await sd.pause();
        const link = links[i];
        link.startAnimate().strokeWidth(3).stroke(C.red).endAnimate();

        await sd.pause();
        const line = coord
            .startAnimate()
            .drawLine(coord.local(link.source()), V.sub(locations[i], locations[i - 1]))
            .endAnimate();
        line.after(0).opacity(0.5);

        await sd.pause();
        link.startAnimate().strokeWidth(1).stroke(C.black).endAnimate();
    }
});
