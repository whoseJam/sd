import * as sd from "@/sd";
import { buildConvex } from "../_/BuildConvex";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const coord = new sd.FixGapCoord(svg).cx(300).y(70).ticks("x", [-4, 6, 1]).ticks("y", [-1, 6, 1]).gap("x", 50);
const linksArr = new sd.Array(svg).x(coord.x() + 20).y(coord.my() + 40);
const nodesArr = new sd.Array(svg).x(coord.x()).y(linksArr.my() + 20);
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
let newSlope = undefined;
let L1 = undefined;
let L2 = undefined;

sd.init(() => {});

sd.main(async () => {
    await buildConvex(
        data.map(v => {
            return { x: v[0], y: v[1] };
        }),
        {
            onStartAdd,
            onAddConvex,
            onPopConvex,
            onCheckSlope,
        }
    );
});

async function onPopConvex() {
    await sd.pause();
    L1.startAnimate().fadeStoT().endAnimate();
    L2.startAnimate().fadeTtoS().endAnimate();
    linksArr.startAnimate().pop().endAnimate();
    nodesArr.startAnimate().pop().endAnimate();
}

async function onStartAdd(i) {
    await sd.pause();
    createNode(i);
    newSlope = undefined;
}

async function onAddConvex(i) {
    if (i > 0) {
        if (!newSlope) {
            await sd.pause();
            newSlope = createLink(i - 1, i);
        }
        await sd.pause();
        data[i].line = newSlope;
        const cloneLink = new sd.Line(svg).source(newSlope.source()).target(newSlope.target()).stroke(newSlope.stroke());
        linksArr.startAnimate();
        linksArr.pushFromExistValue(cloneLink);
        linksArr.endAnimate();
        nodesArr.startAnimate();
        nodesArr.push(`D${i + 1}`);
        nodesArr.endAnimate();
    } else {
        await sd.pause();
        nodesArr.startAnimate();
        nodesArr.push(`D${i + 1}`);
        nodesArr.endAnimate();
    }
}

async function onCheckSlope(i, cllst, clst, k1, k2) {
    await sd.pause();
    L1 = createLink(clst, i);
    L2 = data[clst].line;
    if (k2 <= k1) newSlope = L1;
}

function createLink(a, b) {
    const L = new sd.Line(svg).stroke(C.red);
    L.source(data[a].circle.center());
    L.target(data[b].circle.center());
    L.startAnimate().pointStoT().endAnimate();
    return L;
}

function createNode(i) {
    const [x, y] = data[i];
    data[i].circle = new sd.Circle(coord)
        .r(2)
        .color(C.black)
        .center(coord.global(x, y))
        .strokeWidth(0)
        .childAs(new sd.Math(coord, `(x_{${i + 1}},y_{${i + 1}})`).fontSize(17), R.aside("tc", 2))
        .opacity(0)
        .startAnimate()
        .opacity(1)
        .endAnimate();
}
