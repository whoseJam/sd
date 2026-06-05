import * as sd from "@/sd";
import { calculate, Plane, sortValues } from "../_/Plane";

const svg = sd.svg();
const C = sd.color();
const data = [
    [1, 1],
    [2, 2],
    [2, 3],
    [4, 7],
    [4, 4],
    [6, 5],
    [8, 6],
];
const queries = [
    [3, 3, 6],
    [7, 7, 7],
    [5, 5, 7],
];
const w = 60;
const values = new sd.ValueArray(svg).pushArray(data.map(item => value(item[0], item[1]))).elementWidth(w);
const plane = new Plane(svg, data).gap("x", w).elementHeight(50);
const sum = new sd.Pile(svg).resize(plane.countY()).start(1).elementWidth(plane.gap("y")).elementHeight(plane.gap("y")).start(plane.minY());
const focus = sd.Focus(svg);
const brace = sd.Brace(sum, "l");
let current = 0;

sd.init(() => {
    queries.sort((q1, q2) => {
        return q1[0] - q2[0];
    });
    sd.Label(plane.axis("x"), "p轴", "rc");
    sd.Label(plane.axis("y"), "i轴", "tc");
    values.cx(plane.cx()).y(plane.my() + 40);
    sum.mx(plane.x()).my(plane.my()).opacity(0);
    queries.forEach(([x, L, R], i) => {
        const axis = new sd.Axis(plane)
            .direction("vertical")
            .ticks(1)
            .length(plane.gap("y") * (R - L + 1));
        axis.source(plane.global(x + 0.5, L));
        queries[i].push(axis);
    });
});

sd.main(async () => {
    await sd.pause();
    sum.startAnimate().opacity(1).endAnimate();
    await sortValues(plane, values, ([x1, y1], [x2, y2]) => {
        if (x1 !== x2) return x1 - x2;
        return y1 - y2;
    });
    await calculate(plane, {
        async onMove(x, y, i) {
            await peek(x);
            await sd.pause();
            const value = plane.value(x, i);
            focus.startAnimate().focus(value).endAnimate();
        },
        async onInsert(x, y, i) {
            await sd.pause();
            const circle = plane.circle(x, i);
            const line = sd.Link(circle, sum.element(y)).startAnimate().pointStoT().endAnimate().arrow();
            sum.startAnimate();
            sum.text(y, sum.intValue(y) + 1);
            sum.endAnimate();
        },
    });
});

async function peek(x) {
    while (current < queries.length) {
        if (queries[current][0] <= x) {
            await sd.pause();
            const axis = queries[current][3];
            const t0 = axis.tick(0);
            const t1 = axis.tick(1);
            const l = queries[current][1];
            const r = queries[current][2];
            const l0 = sd.Link(t0, sum.element(l), sd.Line, "x", "y", "mx", "my").opacity(0.5).startAnimate().pointStoT().endAnimate();
            const l1 = sd.Link(t1, sum.element(r), sd.Line, "x", "y", "mx", "y").opacity(0.5).startAnimate().pointStoT().endAnimate();
            brace.startAnimate().brace(l, r).endAnimate();
            sum.startAnimate().color(l, r, C.blue).endAnimate();
            current++;
            await sd.pause();
            l0.startAnimate().fadeStoT().endAnimate().remove();
            l1.startAnimate().fadeStoT().endAnimate().remove();
            brace.startAnimate().opacity(0).endAnimate();
            sum.startAnimate().color(C.white).endAnimate();
        } else break;
    }
}

function value(x, y) {
    const stack = new sd.Stack(svg);
    stack.push(`prev=${x}`);
    stack.push(`i=${y}`);
    return stack.width(w).height(40);
}
