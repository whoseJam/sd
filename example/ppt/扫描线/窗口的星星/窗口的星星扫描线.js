import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const W = 4;
const H = 3;
const stars = [];
const layer = svg.append("g");
const coord = new sd.Coord(svg);
const arr = new sd.Array(svg);
const grad = C.gradient(C.white, C.orange, 0, 3);
const segment = sd.make1d(10, 0);
const nodes = [];
const data = [
    [6, 6],
    [8, 9],
    [8, 5],
    [5, 4],
];

sd.init(() => {
    coord.axis("x").withTickLabel(false);
    arr.x(coord.x())
        .y(coord.my() + 10)
        .elementWidth(30)
        .elementHeight(30)
        .resize(10)
        .opacity(0);
    data.forEach(item => {
        const star = coord.drawCircle(item[0], item[1], 4);
        stars.push(star);
        drawRect(item[0], item[1]);
        nodes.push({
            xl: item[0] - W,
            xr: item[0],
            y: item[1] - H,
            type: +1,
        });
        nodes.push({
            xl: item[0] - W,
            xr: item[0],
            y: item[1],
            type: -1,
        });
    });
});

sd.main(async () => {
    nodes.sort((a, b) => {
        return a.y - b.y;
    });
    await sd.pause();
    const line = new sd.Line(svg).stroke(C.red).strokeWidth(3).source(coord.pos("x", "my")).target(coord.pos("mx", "my")).opacity(0).startAnimate().opacity(1).endAnimate();
    arr.startAnimate().opacity(1).endAnimate();
    for (let i = 0; i < nodes.length; i++) {
        await sd.pause();
        const node = nodes[i];
        const y1 = line.y();
        line.startAnimate().y(coord.globalY(node.y)).endAnimate();
        const y2 = line.y();
        for (let l = 0, r; l < arr.length(); l = r + 1) {
            r = l;
            if (segment[l] === 0) continue;
            while (r + 1 < segment.length && segment[r + 1] === segment[l]) r++;
            new sd.Rect(svg)
                .color(grad(segment[l]))
                .opacity(1)
                .width(arr.element(r).mx() - arr.element(l).x())
                .height(0)
                .x(arr.element(l).x())
                .y(y1)
                .startAnimate()
                .height(y1 - y2)
                .my(y1)
                .endAnimate();
        }
        await sd.pause();
        arr.startAnimate();
        for (let j = node.xl; j < node.xr; j++) {
            segment[j] += node.type;
            arr.color(j, grad(segment[j]));
        }
        arr.endAnimate();
    }
});

function drawRect(x, y) {
    const [minX, maxY] = coord.global(x - W, y - H);
    const [maxX, minY] = coord.global(x, y);
    return new sd.Rect(layer)
        .x(minX)
        .width(maxX - minX)
        .y(minY)
        .height(maxY - minY)
        .fillOpacity(0)
        .stroke(C.textBlue);
}
