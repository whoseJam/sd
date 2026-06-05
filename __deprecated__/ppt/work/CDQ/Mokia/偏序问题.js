import * as sd from "@/sd";

const svg = sd.svg();
const C = sd.color();
const GTA = C.gradient(C.white, C.pureRed, 0, 11);
const GTQ = C.gradient(C.white, C.textBlue, 0, 11);
const coord = new sd.Coord(svg).viewBox(-2, -2, 12, 9).width(480).height(360);
const data = [
    [6, 3],
    [-1, 2],
    [2, 0],
    [3, 4],
    [2, 1, 4, 5],
    [4, 1],
    [1, 2],
    [5, -1],
    [3, 3],
    [1, -1, 2, 3],
];

sd.init(() => {});

sd.main(async () => {
    for (let i = 0; i < data.length; i++) {
        await sd.pause();
        const value = data[i];
        if (value.length === 2) {
            makeCircle(value[0], value[1], GTA, i);
        } else {
            const rect = new sd.Rect(svg)
                .width(coord.globalX(value[2]) - coord.globalX(value[0]))
                .height(coord.globalY(value[1]) - coord.globalY(value[3]))
                .x(coord.globalX(value[0]))
                .my(coord.globalY(value[1]))
                .fillOpacity(0)
                .opacity(0)
                .startAnimate()
                .opacity(1)
                .endAnimate();
            await sd.pause();
            const [x1, y1, x2, y2] = value;
            makeCircle(x2, y2, GTQ, i);
            makeCircle(x1 - 1, y2, GTQ, i);
            makeCircle(x2, y1 - 1, GTQ, i);
            makeCircle(x1 - 1, y1 - 1, GTQ, i);
            await sd.pause();
            rect.startAnimate().opacity(0).endAnimate().remove();
        }
    }
});

function makeCircle(x, y, GT, i) {
    return new sd.Circle(svg)
        .color(GT(i + 1))
        .r(6)
        .center(coord.globalAt(x, y))
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
}
