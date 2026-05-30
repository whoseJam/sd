import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const W = 3;
const H = 2;
const stars = [];
const layer = svg.append("g");
const coord = new sd.Coord(svg);
const rect = coord.drawRect(0, 0, W, H).fillOpacity(0);
const data = [
    [5, 5],
    [6, 7],
    [3, 6],
    [8, 5],
    [7, 4],
    [4, 3],
    [3, 5],
];

sd.init(() => {
    data.forEach(item => {
        const star = coord.drawCircle(item[0], item[1], 4);
        stars.push(star);
    });
    rect.drag(true);
});

sd.main(async () => {
    await sd.pause();
    rect.startAnimate()
        .childAs(new sd.Circle(svg).color(C.black).r(4), (parent, child) => {
            child.center(parent.pos("x", "my"));
        })
        .endAnimate();
    for (let i = 0; i < 1; i++) drawRectAndAppear(data[i][0], data[i][1]);
    await sd.pause();
    for (let i = 1; i < data.length; i++) drawRectAndAppear(data[i][0], data[i][1]);
});

function drawRect(x, y) {
    const [minX, maxY] = coord.global(x - W, y - H);
    const [maxX, minY] = coord.global(x, y);
    return new sd.Rect(layer)
        .x(minX)
        .width(maxX - minX)
        .y(minY)
        .height(maxY - minY);
}

function drawRectAndAppear(x, y) {
    return drawRect(x, y).fillOpacity(0.2).stroke(C.textBlue).fill(C.orange).opacity(0).startAnimate().opacity(1).endAnimate();
}
