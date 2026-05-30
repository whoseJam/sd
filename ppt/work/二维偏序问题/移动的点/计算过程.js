import * as sd from "@/sd";
import { calculate, Plane, sortValues } from "../_/Plane";

const svg = sd.svg();
const C = sd.color();
const R = sd.rule();
const data = [
    [1, 2],
    [3, 1],
    [5, 3],
    [2, 7],
    [4, 9],
    [10, 5],
    [8, 4],
    [7, 6],
];
const w = 60;
const values = new sd.ValueArray(svg).pushArray(data.map(item => value(item[0], item[1]))).elementWidth(w);
const plane = new Plane(svg, data).gap("x", w).elementHeight(50);
const sum = new sd.Pile(svg).resize(plane.countY()).start(1).elementWidth(plane.gap("y")).elementHeight(plane.gap("y")).start(plane.minY());
const focus = sd.Focus(svg);
const brace = sd.Brace(sum, "l");

sd.init(() => {
    sd.Label(plane.axis("x"), "x轴", "rc");
    sd.Label(plane.axis("y"), "v轴", "tc");
    values.cx(plane.cx()).y(plane.my() + 40);
    sum.mx(plane.x()).my(plane.my()).opacity(0);
    sum.forEachElement(element => {
        element.childAs("math", new sd.ValueArray(svg).elementWidth(plane.gap("y")).elementHeight(plane.gap("y")), R.aside("lc", 20));
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
            await sd.pause();
            const value = plane.value(x, i);
            focus.startAnimate().focus(value).endAnimate();
        },
        async onQuery(x, y, i) {
            const value = plane.value(x, i);
            const circle = plane.circle(x, i);
            sd.Link(value, circle).startAnimate().pointStoT().endAnimate().arrow();
            sd.Link(circle, sum.element(y)).opacity(0).after(300).opacity(1).startAnimate().pointStoT().endAnimate().arrow();
            await sd.pause();
            brace.startAnimate().brace(plane.minY(), y).endAnimate();
            sum.startAnimate().color(plane.minY(), y, C.blue).endAnimate();
        },
        async onInsert(x, y, i) {
            await sd.pause();
            brace.startAnimate().opacity(0).endAnimate();
            sum.startAnimate();
            sum.color(plane.minY(), y, C.white);
            sum.text(y, sum.intValue(y) + 1);
            sum.element(y)
                .child("math")
                .push(new sd.Text(sum, `-${x}`));
            sum.endAnimate();
        },
    });
});

function value(x, y) {
    const stack = new sd.Stack(svg);
    stack.push(`x=${x}`);
    stack.push(`v=${y}`);
    return stack.width(w).height(40);
}
