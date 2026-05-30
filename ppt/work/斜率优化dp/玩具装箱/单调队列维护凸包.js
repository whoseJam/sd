import * as sd from "@/sd";
import { buildConvex } from "../_/BuildConvex";

const svg = sd.svg();
const C = sd.color();
const V = sd.vec();
const R = sd.rule();
const coord = new sd.FixGapCoord(svg).cx(300).y(70).ticks("x", [-4, 6, 1]).ticks("y", [-1, 6, 1]).gap("x", 50);
const linksArr = new sd.Array(svg).x(coord.x() + 20).y(coord.my() + 40);
const nodesArr = new sd.Array(svg).x(coord.x()).y(linksArr.my() + 20);
const line = new sd.Line(svg).opacity(0);
const data = [
    [-3, 4, -2],
    [-2, 1, -1.5],
    [-1, 0, -1],
    [0, 5, -0.5],
    [1, 6, 0],
    [2, 3, 0.5],
    [3, 1, 1],
    [4, 3, 1.5],
    [5, 4, 2],
];
let newSlope = undefined;
let L1 = undefined;
let L2 = undefined;
const convex = [];

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
    convex.pop();
    await sd.pause();
    L1.startAnimate().fadeStoT().endAnimate();
    L2.startAnimate().fadeTtoS().endAnimate();
    linksArr.startAnimate().pop().endAnimate();
    nodesArr.startAnimate().pop().endAnimate();
}

async function onStartAdd(i) {
    if (convex.length >= 2) {
        await sd.pause();
        updateLine([1, data[i][2]]);
    }
    await sd.pause();
    createNode(i);
    newSlope = undefined;
}

async function onAddConvex(i) {
    convex.push(i);
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

let lastTarget = undefined;
function updateLine(direction) {
    function slope(i, j) {
        const vi = data[i];
        const vj = data[j];
        console.log("i=", i, "j=", j, "vi=", vi, "vj=", vj);
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

    nodesArr.startAnimate();
    if (typeof lastTarget === "number") nodesArr.color(lastTarget, C.white);
    nodesArr.color(target, C.green);
    nodesArr.endAnimate();

    const id = convex[target];
    const position = coord.global(data[id]);
    const [sx, sy] = V.add(position, [coord.x() - position[0], (coord.x() - position[0]) * globalK]);
    const [tx, ty] = V.add(position, [coord.mx() - position[0], (coord.mx() - position[0]) * globalK]);
    if (line.opacity() === 0) line.source(sx, sy).target(tx, ty).startAnimate().opacity(1).endAnimate();
    else line.startAnimate().source(sx, sy).target(tx, ty).endAnimate();
    lastTarget = target;
}
