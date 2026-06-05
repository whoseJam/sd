import * as sd from "@/sd";
import { buildConvex } from "../_/BuildConvex";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();
const R = sd.rule();
const V = sd.vec();
const math = new sd.Math(svg, "f_i=\\mathop{min}\\limits_{j\\lt i}\\{f_{j}+A_iB_{j}\\}");
const coord = new sd.FixGapCoord(svg).cx(math.cx()).y(70).opacity(0).ticks("x", [-4, 6, 1]).ticks("y", [-1, 6, 1]);
let sliderLabel;
const line = new sd.Line(svg).opacity(0);
const circles = [];
const data = [
    [1, 2],
    [5, 4],
    [-3, 4],
    [-2, 1],
    [3, 1],
    [-1, 0],
    [4, 3],
    [2, 3],
    [1, 6],
];
const convex = await buildConvex(
    data.map(item => {
        return { x: item[0], y: item[1] };
    })
);
const minTick = 0;
const maxTick = 25;
const slider = new sd.Slider(div).min(minTick).max(maxTick).value(4).opacity(0);
slider.onChange(value => {
    const min = -Math.PI / 2;
    const max = Math.PI / 2;
    const k = (value - minTick + 1) / (maxTick + 2 - minTick);
    const current = (max - min) * k + min;
    const direction = V.makeComplex(1, current);
    sd.inter(async () => {
        updateLineByDirection(direction);
    });
});

sd.init(() => {
    sliderLabel = sd.Label(slider, "$-A_i$").opacity(0);
    slider
        .width(80)
        .mx(coord.mx())
        .y(coord.my() + 20);
});

sd.main(async () => {
    const label = [1, 2, 3, 4, "i-2", "i-1"];
    for (let i = 0; i < label.length; i++) {
        await sd.pause();
        math.startAnimate().transformMath(`f_i=\\mathop{min}\\limits_{}\\{f_{${label[i]}}+A_iB_{${label[i]}}\\}`, { 2: 2, 3: 3, 4: 4 }).endAnimate();
    }
    await sd.pause();
    math.startAnimate().transformMath("{f_i}={f_{j_0}}+{A_i}{B_{j_0}}").endAnimate();
    await sd.pause();
    math.startAnimate().transformMath("{f_i}={f_{j_0}}-{(-A_i)}{B_{j_0}}", { 1: 1, 2: 2, 4: 4, 5: 5 }).endAnimate();
    await sd.pause();
    math.element(1).startAnimate().color(C.red).endAnimate();
    math.element(2).startAnimate().color(C.textBlue).endAnimate();
    math.element(4).startAnimate().color(C.red).endAnimate();
    math.element(5).startAnimate().color(C.textBlue).endAnimate();
    await sd.pause();
    const b = math.createMath(1).color(C.red);
    const y = math.createMath(2).color(C.textBlue);
    const k = math.createMath(4).color(C.red);
    const x = math.createMath(5).color(C.textBlue);
    b.startAnimate().transformMath("b").my(50).endAnimate();
    y.startAnimate().transformMath("y").my(50).endAnimate();
    k.startAnimate().transformMath("k").my(50).endAnimate();
    x.startAnimate().transformMath("x").my(50).endAnimate();
    await sd.pause();
    coord.startAnimate();
    coord.opacity(1);
    data.forEach((item, idx) => {
        const circle = coord
            .drawCircle(item[0], item[1], 3)
            .after(0)
            .color(C.black)
            .strokeWidth(0)
            .childAs(new sd.Math(coord, `(B_{${idx + 1}},f_{${idx + 1}})`).fontSize(8), R.aside("tc", 2));
        circles.push(circle);
    });
    coord.endAnimate();
    await sd.pause();
    updateLine([-3, -1], [1, 0.2]);
    line.startAnimate().opacity(1).childAs(new sd.Math(line, "k=-A_i").fontSize(8), R.pointAtPathByRate(1, "x", "cy", 3)).endAnimate();
    for (let i = 0; i < data.length; i++) {
        await sd.pause();
        updateLineByPosition(data[i]);
        circles[i].startAnimate().color(C.red).endAnimate();
        coord.endAnimate();
        await sd.pause();
        circles[i].startAnimate().color(C.black).endAnimate();
    }
    await sd.pause();
    line.drag((dx, dy) => {
        return [0, dy];
    });
    slider.opacity(1);
    sliderLabel.opacity(1);
    await sd.pause();
    for (let i = 0; i + 1 < convex.length; i++) {
        sd.Link(circles[convex[i]], circles[convex[i + 1]])
            .opacity(0)
            .stroke(C.red)
            .after(i * 300)
            .opacity(1)
            .startAnimate()
            .pointStoT()
            .endAnimate();
    }
});

function updateLineByDirection(direction) {
    const w = coord.width() / 2;
    const k = coord.globalK(direction);
    const [cx, cy] = line.center();
    const [sx, sy] = V.add([cx, cy], [-w, -w * k]);
    const [tx, ty] = V.add([cx, cy], [w, w * k]);
    line.startAnimate().source(sx, sy).target(tx, ty).endAnimate();
}

function updateLineByPosition(position) {
    position = coord.global(position);
    const k = (line.y1() - line.y2()) / (line.x1() - line.x2());
    const [sx, sy] = V.add(position, [coord.x() - position[0], (coord.x() - position[0]) * k]);
    const [tx, ty] = V.add(position, [coord.mx() - position[0], (coord.mx() - position[0]) * k]);
    line.startAnimate().source(sx, sy).target(tx, ty).endAnimate();
}

function updateLine(position, direction) {
    position = coord.global(position);
    const k = coord.globalK(direction);
    const [sx, sy] = V.add(position, [coord.x() - position[0], (coord.x() - position[0]) * k]);
    const [tx, ty] = V.add(position, [coord.mx() - position[0], (coord.mx() - position[0]) * k]);
    line.source(sx, sy).target(tx, ty);
}
