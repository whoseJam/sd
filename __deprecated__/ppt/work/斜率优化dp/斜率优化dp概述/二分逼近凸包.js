import * as sd from "@/sd";
import { buildConvex } from "../_/BuildConvex";

const svg = sd.svg();
const div = sd.div();
const C = sd.color();
const R = sd.rule();
const V = sd.vec();
const coord = new sd.FixGapCoord(svg).cx(300).y(70).ticks("x", [-4, 6, 1]).ticks("y", [-1, 6, 1]).gap("x", 50);
const linksArr = new sd.Array(svg).y(coord.my() + 40);
const nodesArr = new sd.Array(svg).y(linksArr.my() + 20);
const line = new sd.Line(svg);
let K = 0;
const data = [
    [-3, 4],
    [-2, 1],
    [-1, 0],
    [0, 5],
    [1, 6],
    [2, 3],
    [3, 1],
    [4, 3],
    [5, 4],
];
const minTick = 0;
const maxTick = 25;
const slider = new sd.Slider(div)
    .min(minTick)
    .max(maxTick)
    .value(0)
    .onChange(value => {
        const min = -Math.PI / 2;
        const max = Math.PI / 2;
        const k = (value - minTick + 1) / (maxTick + 2 - minTick);
        const current = (max - min) * k + min;
        const direction = V.makeComplex(1, current);
        sd.inter(async () => {
            updateLine(direction);
        });
    });
const convex = await buildConvex(
    data.map(v => {
        return { x: v[0], y: v[1] };
    })
);

function createLink(a, b) {
    const L = new sd.Line(svg).stroke(C.red);
    L.source(data[a].circle.center());
    L.target(data[b].circle.center());
    return L;
}

function createNode(i) {
    const [x, y] = data[i];
    data[i].circle = new sd.Circle(coord)
        .r(2)
        .color(C.black)
        .center(coord.global(x, y))
        .strokeWidth(0)
        .childAs(new sd.Math(coord, `(x_{${i + 1}},y_{${i + 1}})`).fontSize(17), R.aside("tc", 2));
}

sd.init(() => {
    for (let i = 0; i < data.length; i++) createNode(i);
    for (let i = 0; i + 1 < convex.length; i++) {
        const link = createLink(convex[i], convex[i + 1]);
        const line = new sd.Line(svg).source(link.source()).target(link.target()).stroke(link.stroke());
        linksArr.push(line);
    }
    for (let i = 0; i < convex.length; i++) nodesArr.push(`D${convex[i] + 1}`);
    linksArr.cx(coord.cx());
    nodesArr.cx(coord.cx());
    updateLine([1, 0], false);
});

sd.main(async () => {
    sd.Label(slider, "k");
    slider.width(200).mx(coord.mx()).my(coord.my());
});

let lastTarget = undefined;
function updateLine(direction, animate = true) {
    function slope(i, j) {
        const vi = data[i];
        const vj = data[j];
        return (vj[1] - vi[1]) / (vj[0] - vi[0]);
    }
    const localK = direction[1] / direction[0];
    const globalK = coord.globalK(direction);

    let target = 0;
    if (localK <= slope(convex[0], convex[1])) target = 0;
    if (localK >= slope(convex[convex.length - 1], convex[convex.length - 2])) target = convex.length - 1;
    for (let i = 1; i < convex.length - 1; i++) {
        const K1 = slope(convex[i], convex[i - 1]);
        const K2 = slope(convex[i], convex[i + 1]);
        if (K1 <= localK && K2 >= localK) target = i;
    }

    if (animate) nodesArr.startAnimate();
    if (typeof lastTarget === "number") nodesArr.color(lastTarget, C.white);
    nodesArr.color(target, C.green);
    if (animate) nodesArr.endAnimate();

    const id = convex[target];
    const position = coord.global(data[id]);
    const [sx, sy] = V.add(position, [coord.x() - position[0], (coord.x() - position[0]) * globalK]);
    const [tx, ty] = V.add(position, [coord.mx() - position[0], (coord.mx() - position[0]) * globalK]);
    if (animate) line.startAnimate();
    line.source(sx, sy).target(tx, ty);
    if (animate) line.endAnimate();
    lastTarget = target;
}
